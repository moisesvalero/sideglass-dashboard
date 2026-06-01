#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use std::sync::Mutex;
use sysinfo::{Components, CpuRefreshKind, MemoryRefreshKind, RefreshKind, System};
use tauri::{
    image::Image,
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, State,
};

#[cfg(target_os = "windows")]
use nvml_wrapper::Nvml;

#[derive(Serialize, Clone)]
pub struct CpuInfo {
    pub name: String,
    pub usage: f32,
    pub temperature: Option<f32>,
    pub cores: usize,
    pub frequency: u64,
}

#[derive(Serialize, Clone)]
pub struct MemoryInfo {
    pub total_gb: f32,
    pub used_gb: f32,
    pub usage_percent: f32,
    pub available_gb: f32,
}

#[derive(Serialize, Clone)]
pub struct GpuInfo {
    pub name: String,
    pub usage: f32,
    pub temperature: Option<f32>,
    pub memory_used_gb: f32,
    pub memory_total_gb: f32,
    pub memory_percent: f32,
}

#[derive(Serialize, Clone)]
pub struct SystemInfo {
    pub cpu: CpuInfo,
    pub memory: MemoryInfo,
    pub gpu: Option<GpuInfo>,
    pub sensors_available: bool,
}

struct ImmersiveBackup {
    position: tauri::PhysicalPosition<i32>,
    size: tauri::PhysicalSize<u32>,
    maximized: bool,
}

struct AppState {
    sys: Mutex<System>,
    #[cfg(target_os = "windows")]
    nvml: Option<Nvml>,
    lhm_started: Mutex<bool>,
    immersive_active: Mutex<bool>,
    immersive_backup: Mutex<Option<ImmersiveBackup>>,
    /// Cached result of the last successful `check()` so install does not re-fetch.
    #[cfg(not(any(target_os = "android", target_os = "ios")))]
    pending_update: Mutex<Option<tauri_plugin_updater::Update>>,
}

#[cfg(windows)]
use std::os::windows::process::CommandExt;

#[cfg(windows)]
fn win_cover_current_monitor(window: &tauri::WebviewWindow) -> Result<(), String> {
    use windows::Win32::Foundation::HWND;
    use windows::Win32::Graphics::Gdi::{
        GetMonitorInfoW, MonitorFromWindow, MONITORINFO, MONITOR_DEFAULTTONEAREST,
    };
    use windows::Win32::UI::WindowsAndMessaging::{
        SetWindowPos, HWND_TOP, SWP_FRAMECHANGED, SWP_SHOWWINDOW,
    };

    let hwnd = HWND(
        window
            .hwnd()
            .map_err(|e| format!("hwnd: {e}"))?
            .0 as *mut _,
    );

    unsafe {
        let monitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST);
        let mut info = MONITORINFO {
            cbSize: std::mem::size_of::<MONITORINFO>() as u32,
            ..Default::default()
        };
        if !GetMonitorInfoW(monitor, &mut info).as_bool() {
            return Err("GetMonitorInfoW failed".into());
        }
        let r = info.rcMonitor;
        let w = r.right - r.left;
        let h = r.bottom - r.top;
        SetWindowPos(
            hwnd,
            HWND_TOP,
            r.left,
            r.top,
            w,
            h,
            SWP_FRAMECHANGED | SWP_SHOWWINDOW,
        )
        .map_err(|e| format!("SetWindowPos: {e}"))?;
    }
    Ok(())
}

#[cfg(windows)]
fn enter_immersive_windows(
    window: &tauri::WebviewWindow,
    state: &tauri::State<'_, AppState>,
) -> Result<(), String> {
    let pos = window.outer_position().map_err(|e| e.to_string())?;
    let size = window.outer_size().map_err(|e| e.to_string())?;
    let maximized = window.is_maximized().unwrap_or(false);
    *state.immersive_backup.lock().unwrap() = Some(ImmersiveBackup {
        position: pos,
        size,
        maximized,
    });

    if maximized {
        window.unmaximize().map_err(|e| e.to_string())?;
    }
    let _ = window.set_fullscreen(false);
    std::thread::sleep(std::time::Duration::from_millis(80));
    win_cover_current_monitor(window)?;
    Ok(())
}

#[cfg(windows)]
fn exit_immersive_windows(
    window: &tauri::WebviewWindow,
    state: &tauri::State<'_, AppState>,
) -> Result<(), String> {
    let _ = window.set_fullscreen(false);
    let backup = state.immersive_backup.lock().unwrap().take();
    if let Some(b) = backup {
        window
            .set_position(b.position)
            .map_err(|e| e.to_string())?;
        window.set_size(b.size).map_err(|e| e.to_string())?;
        if b.maximized {
            let _ = window.maximize();
        }
    }
    Ok(())
}

/// F11 immersive mode: covers the current monitor (hides Windows taskbar) and the
/// frontend hides the custom titlebar. Restores previous size/position on exit.
#[tauri::command]
fn toggle_immersive_fullscreen(
    window: tauri::WebviewWindow,
    state: tauri::State<'_, AppState>,
) -> Result<bool, String> {
    let mut active = state.immersive_active.lock().unwrap();
    let entering = !*active;

    if entering {
        #[cfg(windows)]
        enter_immersive_windows(&window, &state)?;
        #[cfg(not(windows))]
        {
            if window.is_maximized().unwrap_or(false) {
                window.unmaximize().map_err(|e| e.to_string())?;
            }
            window.set_fullscreen(true).map_err(|e| e.to_string())?;
        }
        *active = true;
    } else {
        #[cfg(windows)]
        exit_immersive_windows(&window, &state)?;
        #[cfg(not(windows))]
        {
            window.set_fullscreen(false).map_err(|e| e.to_string())?;
        }
        *active = false;
    }

    Ok(*active)
}

#[tauri::command]
fn is_immersive_fullscreen(state: tauri::State<'_, AppState>) -> bool {
    *state.immersive_active.lock().unwrap()
}

#[cfg(windows)]
fn run_elevated(exe: &std::path::Path, args: &str) -> Result<(), String> {
    use std::os::windows::ffi::OsStrExt;
    use windows::core::PCWSTR;
    use windows::Win32::UI::Shell::{ShellExecuteW, SE_ERR_ACCESSDENIED};
    use windows::Win32::UI::WindowsAndMessaging::SW_SHOWMINNOACTIVE;

    fn to_wide(s: &std::ffi::OsStr) -> Vec<u16> {
        s.encode_wide().chain(std::iter::once(0)).collect()
    }

    let verb: Vec<u16> = "runas\0".encode_utf16().collect();
    let file = to_wide(exe.as_os_str());
    let params_os = std::ffi::OsString::from(args);
    let params = to_wide(&params_os);
    let work_dir_os = exe
        .parent()
        .map(|p| p.as_os_str().to_owned())
        .unwrap_or_default();
    let work_dir = to_wide(&work_dir_os);

    // ShellExecuteW returns HINSTANCE; values <= 32 mean failure.
    let result = unsafe {
        ShellExecuteW(
            None,
            PCWSTR(verb.as_ptr()),
            PCWSTR(file.as_ptr()),
            PCWSTR(params.as_ptr()),
            PCWSTR(work_dir.as_ptr()),
            SW_SHOWMINNOACTIVE,
        )
    };

    let code = result.0 as isize;
    if code > 32 {
        Ok(())
    } else if code == SE_ERR_ACCESSDENIED as isize {
        Err("user_cancelled_uac".into())
    } else {
        Err(format!("ShellExecuteW failed: code {code}"))
    }
}

#[cfg(windows)]
const CREATE_NO_WINDOW: u32 = 0x0800_0000;

/// True when the PawnIO kernel driver service is present (required for CPU
/// package temperature via LibreHardwareMonitor on recent Windows builds).
#[cfg(windows)]
fn is_pawnio_installed() -> bool {
    std::process::Command::new("sc")
        .args(["query", "PawnIO"])
        .creation_flags(CREATE_NO_WINDOW)
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false)
}

#[cfg(windows)]
fn find_pawnio_setup(lhm_exe: &std::path::Path, resource_dir: &std::path::Path) -> Option<std::path::PathBuf> {
    let lhm_dir = lhm_exe.parent()?;
    [
        resource_dir.join("bin").join("PawnIO_setup.exe"),
        resource_dir.join("PawnIO_setup.exe"),
        lhm_dir.join("PawnIO_setup.exe"),
        lhm_dir.join("Resources").join("PawnIO_setup.exe"),
    ]
    .into_iter()
    .find(|p| p.exists())
}

/// Installs PawnIO before LibreHardwareMonitor so LHM does not spawn its own
/// embedded installer (which can fail with STATUS_IMAGE_MACHINE_TYPE_MISMATCH
/// when an old bundled setup runs against a running LHM instance).
#[cfg(windows)]
fn ensure_pawnio_installed(
    lhm_exe: &std::path::Path,
    resource_dir: &std::path::Path,
) -> Result<(), String> {
    if is_pawnio_installed() {
        return Ok(());
    }

    let Some(setup) = find_pawnio_setup(lhm_exe, resource_dir) else {
        return Err("pawnio_setup_missing".into());
    };

    stop_lhm();
    eprintln!("[pawnio] installing via {}", setup.display());

    // PawnIO 2.2+ supports `-install -silent` (see PawnIO.Setup releases).
    let elevated = run_elevated(&setup, "-install -silent")
        .or_else(|_| run_elevated(&setup, "-install"));

    if let Err(e) = elevated {
        if e == "user_cancelled_uac" {
            return Err(e);
        }
        eprintln!("[pawnio] elevated setup launch failed: {e}");
    }

    for attempt in 0..45 {
        if is_pawnio_installed() {
            eprintln!("[pawnio] driver available after {}s", attempt + 1);
            return Ok(());
        }
        std::thread::sleep(std::time::Duration::from_secs(1));
    }

    Err("pawnio_not_installed".into())
}

/// Launches LibreHardwareMonitor (elevated, required for the CPU package
/// sensor over WMI) and waits until temperatures are exposed. When `force` is
/// true it always tears down any existing instance first (a non-elevated
/// instance left running would block elevation because LHM refuses a second
/// instance).
#[cfg(windows)]
fn try_start_lhm(app: &tauri::AppHandle, force: bool) -> Result<bool, String> {
    if !force && read_lhm_temperatures().2 {
        let state = app.state::<AppState>();
        *state.lhm_started.lock().unwrap() = true;
        return Ok(true);
    }

    if !force {
        let state = app.state::<AppState>();
        let guard = state.lhm_started.lock().unwrap();
        if *guard {
            return Ok(read_lhm_temperatures().2);
        }
    }

    let resource_dir = match app.path().resource_dir() {
        Ok(d) => d,
        Err(e) => {
            eprintln!("[lhm] resource_dir error: {e}");
            return Err(format!("resource_dir: {e}"));
        }
    };

    let path = [
        resource_dir.join("bin").join("LibreHardwareMonitor.exe"),
        resource_dir.join("LibreHardwareMonitor.exe"),
    ]
    .into_iter()
    .find(|p| p.exists());

    let Some(path) = path else {
        eprintln!("[lhm] LibreHardwareMonitor.exe not found in resource dir");
        return Err("lhm_exe_missing".into());
    };

    // Force=true: a stale non-elevated instance would block the elevated one
    // from coming up, so kill anything that might be running first.
    if force {
        stop_lhm();
    }

    ensure_pawnio_installed(&path, &resource_dir)?;

    // ShellExecuteW with verb "runas" is the only reliable way to trigger the
    // Windows UAC prompt from a non-elevated process. PowerShell's
    // Start-Process -Verb RunAs with -WindowStyle Hidden can swallow the
    // prompt entirely on some setups (the user reported "no UAC appears").
    eprintln!("[lhm] launching elevated: {}", path.display());
    match run_elevated(&path, "--minimize") {
        Ok(()) => eprintln!("[lhm] UAC accepted, LHM launching"),
        Err(e) => {
            eprintln!("[lhm] elevation failed: {e}");
            if e == "user_cancelled_uac" {
                return Err(e);
            }
            // Best effort: try non-elevated. CPU package temperature won't be
            // exposed, but GPU/board temps may still appear so the UI gets
            // some feedback instead of total silence.
            let work_dir = path.parent().unwrap_or_else(|| path.as_path());
            let _ = std::process::Command::new(&path)
                .current_dir(work_dir)
                .arg("--minimize")
                .creation_flags(CREATE_NO_WINDOW)
                .spawn();
        }
    }

    // WMI provider can take up to ~30s after the process starts to expose
    // the Sensor namespace, especially right after UAC. Poll generously.
    for attempt in 0..30 {
        std::thread::sleep(std::time::Duration::from_secs(1));
        if read_lhm_temperatures().2 {
            let state = app.state::<AppState>();
            *state.lhm_started.lock().unwrap() = true;
            eprintln!("[lhm] sensors available after {}s", attempt + 1);
            return Ok(true);
        }
    }

    eprintln!("[lhm] timed out waiting for sensors (user may have cancelled UAC)");
    Err("lhm_timeout".into())
}

/// Stops LibreHardwareMonitor so its executable is not locked while the
/// updater overwrites the install directory (otherwise NSIS fails with
/// "error opening file for writing LibreHardwareMonitor.exe").
#[cfg(windows)]
fn stop_lhm() {
    // The elevated instance must be killed elevated too; try both contexts.
    let _ = std::process::Command::new("taskkill")
        .args(["/F", "/IM", "LibreHardwareMonitor.exe", "/T"])
        .creation_flags(0x08000000)
        .spawn()
        .and_then(|mut c| c.wait());

    let _ = std::process::Command::new("powershell")
        .args([
            "-NoProfile",
            "-WindowStyle",
            "Hidden",
            "-Command",
            "Start-Process taskkill -ArgumentList '/F','/IM','LibreHardwareMonitor.exe','/T' -Verb RunAs -WindowStyle Hidden -Wait",
        ])
        .creation_flags(0x08000000)
        .spawn()
        .and_then(|mut c| c.wait());

    std::thread::sleep(std::time::Duration::from_millis(800));
}

/// User-initiated activation of the sensor service. Triggers the UAC prompt on
/// demand (more reliable than a silent startup attempt the user may miss) and
/// reports whether temperatures became available.
#[tauri::command]
async fn start_sensor_service(app: tauri::AppHandle) -> Result<bool, String> {
    #[cfg(windows)]
    {
        let handle = app.clone();
        tauri::async_runtime::spawn_blocking(move || try_start_lhm(&handle, true))
            .await
            .map_err(|e| e.to_string())?
    }
    #[cfg(not(windows))]
    {
        let _ = app;
        Ok(false)
    }
}

#[cfg(windows)]
fn variant_to_string(v: &wmi::Variant) -> String {
    match v {
        wmi::Variant::String(s) => s.clone(),
        wmi::Variant::I4(n) => n.to_string(),
        wmi::Variant::R4(n) => n.to_string(),
        wmi::Variant::R8(n) => n.to_string(),
        _ => String::new(),
    }
}

#[cfg(windows)]
fn variant_to_f32(v: &wmi::Variant) -> Option<f32> {
    match v {
        wmi::Variant::I4(n) => Some(*n as f32),
        wmi::Variant::R4(n) => Some(*n),
        wmi::Variant::R8(n) => Some(*n as f32),
        _ => None,
    }
}

#[cfg(windows)]
fn read_lhm_temperatures() -> (Option<f32>, Option<f32>, bool) {
    use std::collections::HashMap;
    use wmi::{COMLibrary, WMIConnection};

    let com = match COMLibrary::new() {
        Ok(c) => c,
        Err(_) => return (None, None, false),
    };

    let wmi_con = match WMIConnection::with_namespace_path("root\\LibreHardwareMonitor", com) {
        Ok(w) => w,
        Err(_) => return (None, None, false),
    };

    let results: Vec<HashMap<String, wmi::Variant>> = match wmi_con.raw_query(
        "SELECT Name, Value, Parent, Identifier FROM Sensor WHERE SensorType = 'Temperature'",
    ) {
        Ok(r) => r,
        Err(_) => return (None, None, false),
    };

    if results.is_empty() {
        return (None, None, false);
    }

    let mut cpu_temp: Option<f32> = None;
    let mut gpu_temp: Option<f32> = None;

    let row_name = |row: &HashMap<String, wmi::Variant>| {
        row.get("Name")
            .map(variant_to_string)
            .unwrap_or_default()
            .to_lowercase()
    };
    let row_parent = |row: &HashMap<String, wmi::Variant>| {
        row.get("Parent")
            .map(variant_to_string)
            .unwrap_or_default()
            .to_lowercase()
    };

    for row in &results {
        let name = row_name(row);
        let parent = row_parent(row);
        let value: f32 = row.get("Value").and_then(variant_to_f32).unwrap_or(0.0);

        if value <= 0.0 || value > 150.0 {
            continue;
        }

        let is_cpuish = name.contains("cpu")
            || parent.contains("cpu")
            || parent.contains("/amdcpu/")
            || parent.contains("/intelcpu/")
            || name.contains("package")
            || name.contains("ccd")
            || name.contains("tdie")
            || name.contains("tctl")
            || name.contains("socket");

        if cpu_temp.is_none()
            && is_cpuish
            && !name.contains("gpu")
            && !parent.contains("gpu")
            && (name.contains("cpu package")
                || name.contains("cpu core")
                || name.contains("core (tctl")
                || name.contains("tctl")
                || name.contains("tdie")
                || name.contains("core max")
                || name.contains("core average")
                || name.contains("ccd")
                || (name.contains("cpu") && name.contains("temperature")))
        {
            cpu_temp = Some(value);
        }

        if gpu_temp.is_none()
            && (name.contains("gpu core")
                || name.contains("graphics")
                || name.contains("gpu hotspot")
                || name.contains("gpu temperature")
                || (name.contains("gpu") && name.contains("temperature")))
        {
            gpu_temp = Some(value);
        }
    }

    for row in &results {
        let name = row_name(row);
        let parent = row_parent(row);
        let value: f32 = row.get("Value").and_then(variant_to_f32).unwrap_or(0.0);
        if value <= 0.0 || value > 150.0 {
            continue;
        }
        if cpu_temp.is_none()
            && (name.contains("cpu") || parent.contains("cpu"))
            && !name.contains("gpu")
            && !parent.contains("gpu")
        {
            cpu_temp = Some(value);
        }
        if gpu_temp.is_none() && (name.contains("gpu") || parent.contains("gpu")) {
            gpu_temp = Some(value);
        }
    }

    // Last resort: highest plausible CPU-zone reading (excludes GPU by parent/name).
    if cpu_temp.is_none() {
        for row in &results {
            let name = row_name(row);
            let parent = row_parent(row);
            let value: f32 = row.get("Value").and_then(variant_to_f32).unwrap_or(0.0);
            if value < 20.0 || value > 150.0 {
                continue;
            }
            if name.contains("gpu") || parent.contains("gpu") {
                continue;
            }
            if name.contains("cpu")
                || parent.contains("cpu")
                || parent.contains("amdcpu")
                || parent.contains("intelcpu")
            {
                cpu_temp = Some(cpu_temp.map(|t| t.max(value)).unwrap_or(value));
            }
        }
    }

    let available = cpu_temp.is_some();
    (cpu_temp, gpu_temp, available)
}

/// Fallback when LHM WMI has no CPU sensor (some boards expose ACPI thermal zones).
#[cfg(windows)]
fn read_wmi_thermal_zone_cpu_temp() -> Option<f32> {
    use std::collections::HashMap;
    use wmi::{COMLibrary, WMIConnection};

    let com = COMLibrary::new().ok()?;
    let wmi_con = WMIConnection::new(com).ok()?;
    let results: Vec<HashMap<String, wmi::Variant>> = wmi_con
        .raw_query("SELECT CurrentTemperature FROM MSAcpi_ThermalZoneTemperature")
        .ok()?;

    let mut best: Option<f32> = None;
    for row in &results {
        let raw = row.get("CurrentTemperature").and_then(variant_to_f32)?;
        // ACPI: tenths of a Kelvin → °C
        let celsius = (raw / 10.0) - 273.15;
        if (20.0..=120.0).contains(&celsius) {
            best = Some(best.map(|b| b.max(celsius)).unwrap_or(celsius));
        }
    }
    best
}

#[cfg(not(windows))]
fn read_wmi_thermal_zone_cpu_temp() -> Option<f32> {
    None
}

fn cpu_temp_from_components() -> Option<f32> {
    for component in Components::new_with_refreshed_list().iter() {
        let label = component.label().to_lowercase();
        let temp = component.temperature();
        if temp > 0.0
            && (label.contains("cpu") || label.contains("package") || label.contains("tctl"))
        {
            return Some(temp);
        }
    }
    None
}

#[cfg(not(windows))]
fn read_lhm_temperatures() -> (Option<f32>, Option<f32>, bool) {
    (None, None, false)
}

#[tauri::command]
fn get_system_info(state: State<AppState>) -> SystemInfo {
    let mut sys = state.sys.lock().unwrap();

    sys.refresh_cpu_specifics(CpuRefreshKind::everything());
    sys.refresh_memory_specifics(MemoryRefreshKind::everything());

    let cpu_usage: f32 =
        sys.cpus().iter().map(|cpu| cpu.cpu_usage()).sum::<f32>() / sys.cpus().len() as f32;

    let cpu_name = sys
        .cpus()
        .first()
        .map(|cpu| cpu.brand().to_string())
        .unwrap_or_else(|| "Unknown CPU".to_string());

    let cpu_freq = sys.cpus().first().map(|cpu| cpu.frequency()).unwrap_or(0);

    let (lhm_cpu_temp, lhm_gpu_temp, _) = read_lhm_temperatures();
    let cpu_temp = lhm_cpu_temp
        .or_else(cpu_temp_from_components)
        .or_else(read_wmi_thermal_zone_cpu_temp);
    // Only CPU temperature counts — GPU via NVML must not hide the CPU activation UI.
    let sensors_available = cpu_temp.is_some();

    let cpu_info = CpuInfo {
        name: cpu_name,
        usage: cpu_usage,
        temperature: cpu_temp,
        cores: sys.cpus().len(),
        frequency: cpu_freq,
    };

    let total_memory = sys.total_memory() as f32 / 1_073_741_824.0;
    let used_memory = sys.used_memory() as f32 / 1_073_741_824.0;
    let available_memory = sys.available_memory() as f32 / 1_073_741_824.0;

    let memory_info = MemoryInfo {
        total_gb: total_memory,
        used_gb: used_memory,
        usage_percent: (used_memory / total_memory) * 100.0,
        available_gb: available_memory,
    };

    let gpu_info = get_gpu_info(&state, lhm_gpu_temp);

    SystemInfo {
        cpu: cpu_info,
        memory: memory_info,
        gpu: gpu_info,
        sensors_available,
    }
}

fn get_gpu_info(state: &State<AppState>, lhm_gpu_temp: Option<f32>) -> Option<GpuInfo> {
    #[cfg(target_os = "windows")]
    {
        if let Some(gpu) = get_nvidia_gpu(state) {
            return Some(GpuInfo {
                temperature: gpu.temperature.or(lhm_gpu_temp),
                ..gpu
            });
        }
    }

    if let Some(temp) = lhm_gpu_temp {
        return Some(GpuInfo {
            name: "GPU".to_string(),
            usage: 0.0,
            temperature: Some(temp),
            memory_used_gb: 0.0,
            memory_total_gb: 0.0,
            memory_percent: 0.0,
        });
    }

    get_gpu_via_components()
}

#[cfg(target_os = "windows")]
fn get_nvidia_gpu(state: &State<AppState>) -> Option<GpuInfo> {
    if let Some(ref nvml) = state.nvml {
        if let Ok(device) = nvml.device_by_index(0) {
            let name = device.name().unwrap_or_else(|_| "NVIDIA GPU".to_string());
            let usage = device
                .utilization_rates()
                .map(|u| u.gpu as f32)
                .unwrap_or(0.0);
            let temperature = device
                .temperature(nvml_wrapper::enum_wrappers::device::TemperatureSensor::Gpu)
                .map(|t| t as f32)
                .ok();

            let memory = device.memory_info().ok();
            let (memory_used, memory_total) = memory
                .map(|m| {
                    (
                        m.used as f32 / 1_073_741_824.0,
                        m.total as f32 / 1_073_741_824.0,
                    )
                })
                .unwrap_or((0.0, 0.0));

            let memory_percent = if memory_total > 0.0 {
                (memory_used / memory_total) * 100.0
            } else {
                0.0
            };

            return Some(GpuInfo {
                name,
                usage,
                temperature,
                memory_used_gb: memory_used,
                memory_total_gb: memory_total,
                memory_percent,
            });
        }
    }
    None
}

fn get_gpu_via_components() -> Option<GpuInfo> {
    let mut gpu_temp: Option<f32> = None;
    let mut gpu_name = String::from("GPU");

    for component in Components::new_with_refreshed_list().iter() {
        let label = component.label().to_lowercase();
        if label.contains("gpu") {
            let temp = component.temperature();
            if temp > 0.0 {
                gpu_temp = Some(temp);
            }
            if label.contains("nvidia")
                || label.contains("amd")
                || label.contains("radeon")
                || label.contains("intel")
                || label.contains("arc")
            {
                gpu_name = component.label().to_string();
            }
        }
    }

    gpu_temp.map(|temp| GpuInfo {
        name: gpu_name,
        usage: 0.0,
        temperature: Some(temp),
        memory_used_gb: 0.0,
        memory_total_gb: 0.0,
        memory_percent: 0.0,
    })
}

#[tauri::command]
async fn fetch_ical(url: String) -> Result<String, String> {
    if !(url.starts_with("https://") || url.starts_with("http://")) {
        return Err("Invalid URL scheme".to_string());
    }

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(15))
        .build()
        .map_err(|e| e.to_string())?;

    let res = client.get(&url).send().await.map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        return Err(format!("HTTP {}", res.status()));
    }

    res.text().await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn open_url(url: String) -> Result<(), String> {
    tauri_plugin_opener::open_url(&url, None::<&str>).map_err(|e| e.to_string())
}

#[derive(Serialize, Clone)]
pub struct YoutubeResult {
    pub id: String,
    pub title: String,
    pub channel: String,
    pub thumbnail: String,
}

/// Extracts the first balanced JSON object starting at the beginning of `s`.
fn extract_balanced_json(s: &str) -> Option<String> {
    let bytes = s.as_bytes();
    if bytes.first() != Some(&b'{') {
        return None;
    }
    let mut depth = 0i32;
    let mut in_string = false;
    let mut escaped = false;
    for (i, &b) in bytes.iter().enumerate() {
        if in_string {
            if escaped {
                escaped = false;
            } else if b == b'\\' {
                escaped = true;
            } else if b == b'"' {
                in_string = false;
            }
            continue;
        }
        match b {
            b'"' => in_string = true,
            b'{' => depth += 1,
            b'}' => {
                depth -= 1;
                if depth == 0 {
                    return Some(s[..=i].to_string());
                }
            }
            _ => {}
        }
    }
    None
}

fn extract_yt_initial_data(html: &str) -> Option<String> {
    for marker in ["var ytInitialData = ", "ytInitialData = "] {
        if let Some(start) = html.find(marker) {
            let rest = &html[start + marker.len()..];
            if let Some(obj) = extract_balanced_json(rest) {
                return Some(obj);
            }
        }
    }
    None
}

fn parse_video_renderer(vr: &serde_json::Value) -> Option<YoutubeResult> {
    let id = vr.get("videoId")?.as_str()?.to_string();
    if id.is_empty() {
        return None;
    }

    let title = vr
        .get("title")
        .and_then(|t| t.get("runs"))
        .and_then(|r| r.get(0))
        .and_then(|r| r.get("text"))
        .and_then(|t| t.as_str())
        .or_else(|| {
            vr.get("title")
                .and_then(|t| t.get("simpleText"))
                .and_then(|t| t.as_str())
        })
        .unwrap_or("")
        .to_string();
    if title.is_empty() {
        return None;
    }

    let channel = vr
        .get("ownerText")
        .and_then(|o| o.get("runs"))
        .and_then(|r| r.get(0))
        .and_then(|r| r.get("text"))
        .and_then(|t| t.as_str())
        .or_else(|| {
            vr.get("longBylineText")
                .and_then(|o| o.get("runs"))
                .and_then(|r| r.get(0))
                .and_then(|r| r.get("text"))
                .and_then(|t| t.as_str())
        })
        .unwrap_or("")
        .to_string();

    Some(YoutubeResult {
        thumbnail: format!("https://i.ytimg.com/vi/{id}/mqdefault.jpg"),
        id,
        title,
        channel,
    })
}

fn collect_video_renderers(value: &serde_json::Value, out: &mut Vec<YoutubeResult>) {
    if out.len() >= 12 {
        return;
    }
    match value {
        serde_json::Value::Object(map) => {
            if let Some(vr) = map.get("videoRenderer") {
                if let Some(result) = parse_video_renderer(vr) {
                    if !out.iter().any(|r| r.id == result.id) {
                        out.push(result);
                    }
                }
            }
            for v in map.values() {
                collect_video_renderers(v, out);
            }
        }
        serde_json::Value::Array(arr) => {
            for v in arr {
                collect_video_renderers(v, out);
            }
        }
        _ => {}
    }
}

#[tauri::command]
async fn youtube_search(query: String) -> Result<Vec<YoutubeResult>, String> {
    let q = query.trim();
    if q.is_empty() {
        return Ok(vec![]);
    }

    let url =
        reqwest::Url::parse_with_params("https://www.youtube.com/results", &[("search_query", q)])
            .map_err(|e| e.to_string())?;

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(15))
        .user_agent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 \
             (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        )
        .build()
        .map_err(|e| e.to_string())?;

    let html = client
        .get(url)
        .header("Accept-Language", "es-ES,es;q=0.9,en;q=0.8")
        .header("Cookie", "CONSENT=YES+cb")
        .send()
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;

    let json = extract_yt_initial_data(&html).ok_or("No se pudo leer la respuesta de YouTube")?;
    let data: serde_json::Value = serde_json::from_str(&json).map_err(|e| e.to_string())?;

    let mut results = Vec::new();
    collect_video_renderers(&data, &mut results);
    results.truncate(12);
    Ok(results)
}

#[tauri::command]
async fn toggle_main_window(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        if window.is_visible().unwrap_or(true) {
            let _ = window.hide();
        } else {
            let _ = window.show();
            let _ = window.set_focus();
        }
    }
    Ok(())
}

#[tauri::command]
async fn set_autostart(app: tauri::AppHandle, enabled: bool) -> Result<(), String> {
    use tauri_plugin_autostart::ManagerExt;
    let autostart = app.autolaunch();
    if enabled {
        autostart.enable().map_err(|e| e.to_string())?;
    } else {
        autostart.disable().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn register_global_hotkey(app: tauri::AppHandle, accelerator: String) -> Result<(), String> {
    use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};

    app.global_shortcut().unregister_all().ok();

    let app_handle = app.clone();
    app.global_shortcut()
        .on_shortcut(accelerator.as_str(), move |_app, _shortcut, event| {
            if event.state == ShortcutState::Pressed {
                let handle = app_handle.clone();
                tauri::async_runtime::spawn(async move {
                    let _ = toggle_main_window(handle).await;
                });
            }
        })
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[derive(serde::Serialize, Clone)]
struct UpdateInfo {
    available: bool,
    version: String,
    notes: String,
}

#[derive(serde::Serialize, Clone)]
struct UpdateProgress {
    downloaded: u64,
    total: u64,
    percent: f64,
    /// True when the server did not send Content-Length (common on GitHub).
    indeterminate: bool,
}

/// Phase 1: only checks whether a new version exists (no download/install), so
/// the UI can show a "new version found" prompt and let the user decide.
#[tauri::command]
async fn check_for_updates(
    app: tauri::AppHandle,
    state: State<'_, AppState>,
) -> Result<UpdateInfo, String> {
    use tauri_plugin_updater::UpdaterExt;

    let updater = app
        .updater_builder()
        .timeout(std::time::Duration::from_secs(20))
        .build()
        .map_err(|e| e.to_string())?;
    match updater.check().await.map_err(|e| e.to_string())? {
        Some(update) => {
            let info = UpdateInfo {
                available: true,
                version: update.version.clone(),
                notes: update.body.clone().unwrap_or_default(),
            };
            #[cfg(not(any(target_os = "android", target_os = "ios")))]
            {
                *state.pending_update.lock().unwrap() = Some(update);
            }
            Ok(info)
        }
        None => {
            #[cfg(not(any(target_os = "android", target_os = "ios")))]
            {
                *state.pending_update.lock().unwrap() = None;
            }
            Ok(UpdateInfo {
                available: false,
                version: String::new(),
                notes: String::new(),
            })
        }
    }
}

#[tauri::command]
fn dismiss_pending_update(state: State<'_, AppState>) {
    #[cfg(not(any(target_os = "android", target_os = "ios")))]
    {
        *state.pending_update.lock().unwrap() = None;
    }
    let _ = state;
}

/// Phase 2: downloads and installs the update, emitting `update://progress`
/// events so the UI can render a real progress bar.
fn emit_update_progress(app: &tauri::AppHandle, downloaded: u64, total: u64) {
    use tauri::Emitter;
    let indeterminate = total == 0;
    let percent = if total > 0 {
        ((downloaded as f64 / total as f64) * 100.0).min(99.0)
    } else {
        0.0
    };
    let _ = app.emit(
        "update://progress",
        UpdateProgress {
            downloaded,
            total,
            percent,
            indeterminate,
        },
    );
}

#[tauri::command]
async fn install_update(app: tauri::AppHandle, state: State<'_, AppState>) -> Result<String, String> {
    use tauri::Emitter;

    let update = {
        #[cfg(not(any(target_os = "android", target_os = "ios")))]
        {
            state.pending_update.lock().unwrap().take()
        }
        #[cfg(any(target_os = "android", target_os = "ios"))]
        {
            None
        }
    }
    .ok_or_else(|| {
        "No hay actualización pendiente. Pulsa «Buscar actualizaciones» de nuevo.".to_string()
    })?;

    emit_update_progress(&app, 0, 0);

    // Stop LHM so the installer can overwrite files (max 8s, non-fatal if it fails).
    #[cfg(windows)]
    {
        *state.lhm_started.lock().unwrap() = false;
        let _ = tauri::async_runtime::spawn_blocking(stop_lhm).await;
    }

    let progress_app = app.clone();
    let progress_done = app.clone();
    let mut downloaded: u64 = 0;
    let version = update.version.clone();

    update
        .download_and_install(
            move |chunk_len, content_length| {
                downloaded += chunk_len as u64;
                let total = content_length.unwrap_or(0);
                emit_update_progress(&progress_app, downloaded, total);
            },
            move || {
                let _ = progress_done.emit(
                    "update://progress",
                    UpdateProgress {
                        downloaded: 0,
                        total: 0,
                        percent: 99.0,
                        indeterminate: false,
                    },
                );
            },
        )
        .await
        .map_err(|e| format!("{e}"))?;

    let _ = app.emit("update://finished", ());
    Ok(format!("updated_to_{version}"))
}

/// Relaunches the app after an update has been installed.
#[tauri::command]
fn restart_app(app: tauri::AppHandle) {
    app.restart();
}

#[tauri::command]
async fn send_notification(
    app: tauri::AppHandle,
    title: String,
    body: String,
) -> Result<(), String> {
    use tauri_plugin_notification::NotificationExt;
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .map_err(|e| e.to_string())
}

fn main() {
    let sys = System::new_with_specifics(
        RefreshKind::new()
            .with_cpu(CpuRefreshKind::everything())
            .with_memory(MemoryRefreshKind::everything()),
    );

    #[cfg(target_os = "windows")]
    let nvml = Nvml::init().ok();

    #[cfg(target_os = "windows")]
    let app_state = AppState {
        sys: Mutex::new(sys),
        nvml,
        lhm_started: Mutex::new(false),
        immersive_active: Mutex::new(false),
        immersive_backup: Mutex::new(None),
        #[cfg(not(any(target_os = "android", target_os = "ios")))]
        pending_update: Mutex::new(None),
    };

    #[cfg(not(target_os = "windows"))]
    let app_state = AppState {
        sys: Mutex::new(sys),
        lhm_started: Mutex::new(false),
        immersive_active: Mutex::new(false),
        immersive_backup: Mutex::new(None),
        #[cfg(not(any(target_os = "android", target_os = "ios")))]
        pending_update: Mutex::new(None),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_window_state::Builder::new()
                .with_state_flags(
                    tauri_plugin_window_state::StateFlags::POSITION
                        | tauri_plugin_window_state::StateFlags::MAXIMIZED,
                )
                .build(),
        )
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            get_system_info,
            fetch_ical,
            open_url,
            youtube_search,
            toggle_main_window,
            set_autostart,
            register_global_hotkey,
            send_notification,
            check_for_updates,
            install_update,
            dismiss_pending_update,
            restart_app,
            start_sensor_service,
            toggle_immersive_fullscreen,
            is_immersive_fullscreen,
        ])
        .setup(|app| {
            // LHM/PawnIO are started only when the user taps «Activar °C» so
            // opening Sideglass does not trigger PawnIO/LHM installers or UAC.

            if let Some(window) = app.get_webview_window("main") {
                let _ = window.maximize();
            }

            let show = MenuItemBuilder::with_id("show", "Mostrar").build(app)?;
            let hide = MenuItemBuilder::with_id("hide", "Ocultar").build(app)?;
            let quit = MenuItemBuilder::with_id("quit", "Salir").build(app)?;

            let menu = MenuBuilder::new(app)
                .item(&show)
                .item(&hide)
                .separator()
                .item(&quit)
                .build()?;

            let tray_icon = app
                .default_window_icon()
                .cloned()
                .unwrap_or_else(|| Image::new_owned(vec![60, 100, 200, 255], 1, 1));

            let _tray = TrayIconBuilder::new()
                .icon(tray_icon)
                .menu(&menu)
                .tooltip("Sideglass")
                .on_menu_event(move |app, event| {
                    let window = app.get_webview_window("main").unwrap();
                    match event.id().as_ref() {
                        "show" => {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                        "hide" => {
                            let _ = window.hide();
                        }
                        "quit" => {
                            std::process::exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_visible().unwrap_or(true) {
                                let _ = window.hide();
                            } else {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
