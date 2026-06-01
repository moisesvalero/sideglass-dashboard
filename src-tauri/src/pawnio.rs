//! In-process CPU temperature reading through the PawnIO kernel driver.
//!
//! This replaces launching the LibreHardwareMonitor GUI: we talk to the signed
//! PawnIO driver directly (the same protocol LibreHardwareMonitorLib uses) and
//! load the official signed modules (`IntelMSR.bin` / `AMDFamily17.bin`) to read
//! the temperature registers. Opening the PawnIO device requires the process to
//! be elevated, which is why this runs inside the hidden elevated helper.
//!
//! Temperature math is ported from LibreHardwareMonitor:
//! - Intel: TjMax (MSR 0x1A2) minus the digital readout of the package/core
//!   thermal status (MSR 0x1B1 / 0x19C).
//! - AMD (Zen): SMN `THM_TCON_CUR_TMP` (0x59800), Tctl scaling and the model
//!   Tdie offset table.

#![cfg(windows)]

use std::ffi::c_void;
use std::path::Path;

use windows::core::PCWSTR;
use windows::Win32::Foundation::{CloseHandle, HANDLE};
use windows::Win32::Storage::FileSystem::{
    CreateFileW, FILE_ATTRIBUTE_NORMAL, FILE_SHARE_READ, FILE_SHARE_WRITE, OPEN_EXISTING,
};
use windows::Win32::System::IO::DeviceIoControl;

const DEVICE_PATH: &str = r"\\?\GLOBALROOT\Device\PawnIO";
/// GENERIC_READ | GENERIC_WRITE.
const GENERIC_RW: u32 = 0xC000_0000;
/// (41394u << 16) | (0x821 << 2)
const IOCTL_LOAD: u32 = 0xA1B2_2084;
/// (41394u << 16) | (0x841 << 2)
const IOCTL_EXEC: u32 = 0xA1B2_2104;
const FN_NAME_LEN: usize = 32;

const SMN_THM_TCON_CUR_TMP: i64 = 0x0005_9800;
const MSR_TEMPERATURE_TARGET: i64 = 0x1A2;
const MSR_IA32_PACKAGE_THERM_STATUS: i64 = 0x1B1;
const MSR_IA32_THERM_STATUS: i64 = 0x19C;

struct PawnIoDevice {
    handle: HANDLE,
}

impl PawnIoDevice {
    fn open() -> Option<Self> {
        let wide: Vec<u16> = DEVICE_PATH
            .encode_utf16()
            .chain(std::iter::once(0))
            .collect();

        let handle = unsafe {
            CreateFileW(
                PCWSTR(wide.as_ptr()),
                GENERIC_RW,
                FILE_SHARE_READ | FILE_SHARE_WRITE,
                None,
                OPEN_EXISTING,
                FILE_ATTRIBUTE_NORMAL,
                None,
            )
        }
        .ok()?;

        Some(PawnIoDevice { handle })
    }

    fn load(&self, blob: &[u8]) -> bool {
        unsafe {
            DeviceIoControl(
                self.handle,
                IOCTL_LOAD,
                Some(blob.as_ptr() as *const c_void),
                blob.len() as u32,
                None,
                0,
                None,
                None,
            )
        }
        .is_ok()
    }

    fn execute(&self, name: &str, input: &[i64], out_len: usize) -> Option<Vec<i64>> {
        let mut in_buf = vec![0u8; FN_NAME_LEN + input.len() * 8];
        let name_bytes = name.as_bytes();
        let copy = name_bytes.len().min(FN_NAME_LEN - 1);
        in_buf[..copy].copy_from_slice(&name_bytes[..copy]);
        for (i, value) in input.iter().enumerate() {
            let off = FN_NAME_LEN + i * 8;
            in_buf[off..off + 8].copy_from_slice(&value.to_le_bytes());
        }

        let mut out_buf = vec![0u8; out_len.max(1) * 8];
        let mut returned: u32 = 0;

        let ok = unsafe {
            DeviceIoControl(
                self.handle,
                IOCTL_EXEC,
                Some(in_buf.as_ptr() as *const c_void),
                in_buf.len() as u32,
                Some(out_buf.as_mut_ptr() as *mut c_void),
                out_buf.len() as u32,
                Some(&mut returned),
                None,
            )
        }
        .is_ok();

        if !ok {
            return None;
        }

        let count = (returned as usize) / 8;
        let mut out = Vec::with_capacity(count);
        for i in 0..count {
            let mut b = [0u8; 8];
            b.copy_from_slice(&out_buf[i * 8..i * 8 + 8]);
            out.push(i64::from_le_bytes(b));
        }
        Some(out)
    }
}

impl Drop for PawnIoDevice {
    fn drop(&mut self) {
        unsafe {
            let _ = CloseHandle(self.handle);
        }
    }
}

/// True when the PawnIO kernel device can be opened (driver loaded and reachable).
pub fn device_available() -> bool {
    PawnIoDevice::open().is_some()
}

#[derive(Clone, Copy)]
enum Vendor {
    Amd,
    Intel,
}

fn cpu_vendor() -> Option<Vendor> {
    use std::arch::x86_64::__cpuid;
    // CPUID leaf 0 (vendor string) is part of the x86_64 baseline; the intrinsic
    // is safe on this target.
    let r = __cpuid(0);
    let mut bytes = [0u8; 12];
    bytes[0..4].copy_from_slice(&r.ebx.to_le_bytes());
    bytes[4..8].copy_from_slice(&r.edx.to_le_bytes());
    bytes[8..12].copy_from_slice(&r.ecx.to_le_bytes());
    let vendor = String::from_utf8_lossy(&bytes);
    if vendor.contains("AuthenticAMD") {
        Some(Vendor::Amd)
    } else if vendor.contains("GenuineIntel") {
        Some(Vendor::Intel)
    } else {
        None
    }
}

/// Tdie offset table (Tdie = Tctl + offset), ported from LibreHardwareMonitor /
/// the Linux k10temp driver. Modern Ryzen (Zen 2+) report 0.
fn amd_tdie_offset(cpu_name: &str) -> f32 {
    if cpu_name.contains("1600X") || cpu_name.contains("1700X") || cpu_name.contains("1800X") {
        -20.0
    } else if cpu_name.contains("Threadripper 19") || cpu_name.contains("Threadripper 29") {
        -27.0
    } else if cpu_name.contains("2700X") {
        -10.0
    } else {
        0.0
    }
}

/// A loaded PawnIO sensor for the running CPU. Created once, read repeatedly.
pub struct Sensor {
    device: PawnIoDevice,
    vendor: Vendor,
    cpu_name: String,
}

impl Sensor {
    /// Opens the PawnIO device (requires elevation) and loads the module that
    /// matches the CPU vendor. Returns `None` if the device cannot be opened or
    /// the module cannot be loaded.
    pub fn init(intel_module: &Path, amd_module: &Path, cpu_name: &str) -> Option<Sensor> {
        let vendor = cpu_vendor()?;
        let device = PawnIoDevice::open()?;

        let module_path = match vendor {
            Vendor::Amd => amd_module,
            Vendor::Intel => intel_module,
        };
        let blob = std::fs::read(module_path).ok()?;
        if !device.load(&blob) {
            return None;
        }

        Some(Sensor {
            device,
            vendor,
            cpu_name: cpu_name.to_string(),
        })
    }

    /// Returns the current CPU package temperature in °C, or `None` if the read
    /// failed or produced an implausible value.
    pub fn read(&self) -> Option<f32> {
        let temp = match self.vendor {
            Vendor::Amd => self.read_amd()?,
            Vendor::Intel => self.read_intel()?,
        };
        if (5.0..=125.0).contains(&temp) {
            Some(temp)
        } else {
            None
        }
    }

    fn read_amd(&self) -> Option<f32> {
        let result = self
            .device
            .execute("ioctl_read_smn", &[SMN_THM_TCON_CUR_TMP], 1)?;
        let raw = *result.first()? as u32;

        // The 49 °C range adjustment can be signalled via RANGE_SEL (bit 19) or
        // TJ_SEL (bits 17:16) on newer Zen parts.
        let offset_flag = (raw & 0x8_0000) != 0 || (raw & 0x3_0000) == 0x3_0000;
        let mut tctl = ((raw >> 21) as f32) * 0.125;
        if offset_flag {
            tctl -= 49.0;
        }
        Some(tctl + amd_tdie_offset(&self.cpu_name))
    }

    fn read_intel(&self) -> Option<f32> {
        let target = self
            .device
            .execute("ioctl_read_msr", &[MSR_TEMPERATURE_TARGET], 1)?;
        let tjmax = ((*target.first()? >> 16) & 0xFF).max(1);
        let tjmax = if tjmax == 0 { 100 } else { tjmax };

        // Prefer the package thermal status (valid bit 31); fall back to the
        // per-core thermal status.
        let therm = self
            .device
            .execute("ioctl_read_msr", &[MSR_IA32_PACKAGE_THERM_STATUS], 1)
            .and_then(|v| v.into_iter().next())
            .filter(|v| (*v >> 31) & 1 == 1)
            .or_else(|| {
                self.device
                    .execute("ioctl_read_msr", &[MSR_IA32_THERM_STATUS], 1)
                    .and_then(|v| v.into_iter().next())
            })?;

        let readout = (therm >> 16) & 0x7F;
        Some((tjmax - readout) as f32)
    }
}
