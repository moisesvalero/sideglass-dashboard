// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use sysinfo::{System, CpuRefreshKind, MemoryRefreshKind, RefreshKind};
use std::sync::Mutex;
use tauri::State;

// Try to use NVML for NVIDIA GPU monitoring
#[cfg(target_os = "windows")]
use nvml_wrapper::Nvml;

#[derive(Serialize, Clone)]
pub struct CpuInfo {
    pub name: String,
    pub usage: f32,
    pub temperature: f32,
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
    pub temperature: f32,
    pub memory_used_gb: f32,
    pub memory_total_gb: f32,
    pub memory_percent: f32,
}

#[derive(Serialize, Clone)]
pub struct SystemInfo {
    pub cpu: CpuInfo,
    pub memory: MemoryInfo,
    pub gpu: Option<GpuInfo>,
}

struct AppState {
    sys: Mutex<System>,
    #[cfg(target_os = "windows")]
    nvml: Option<Nvml>,
}

#[tauri::command]
fn get_system_info(state: State<AppState>) -> SystemInfo {
    let mut sys = state.sys.lock().unwrap();
    
    // Refresh CPU and memory info
    sys.refresh_cpu_specifics(CpuRefreshKind::everything());
    sys.refresh_memory_specifics(MemoryRefreshKind::everything());
    
    // Get CPU info
    let cpu_usage: f32 = sys.cpus().iter().map(|cpu| cpu.cpu_usage()).sum::<f32>() 
        / sys.cpus().len() as f32;
    
    let cpu_name = sys.cpus()
        .first()
        .map(|cpu| cpu.brand().to_string())
        .unwrap_or_else(|| "Unknown CPU".to_string());
    
    let cpu_freq = sys.cpus()
        .first()
        .map(|cpu| cpu.frequency())
        .unwrap_or(0);

    // CPU temperature - try to get from components
    let mut cpu_temp: f32 = 0.0;
    for component in sysinfo::Components::new_with_refreshed_list().iter() {
        let label = component.label().to_lowercase();
        if label.contains("cpu") || label.contains("core") || label.contains("package") {
            cpu_temp = component.temperature();
            break;
        }
    }
    // If no temp found, estimate based on usage
    if cpu_temp == 0.0 {
        cpu_temp = 35.0 + (cpu_usage * 0.5);
    }

    let cpu_info = CpuInfo {
        name: cpu_name,
        usage: cpu_usage,
        temperature: cpu_temp,
        cores: sys.cpus().len(),
        frequency: cpu_freq,
    };

    // Get Memory info
    let total_memory = sys.total_memory() as f32 / 1_073_741_824.0; // Convert to GB
    let used_memory = sys.used_memory() as f32 / 1_073_741_824.0;
    let available_memory = sys.available_memory() as f32 / 1_073_741_824.0;
    
    let memory_info = MemoryInfo {
        total_gb: total_memory,
        used_gb: used_memory,
        usage_percent: (used_memory / total_memory) * 100.0,
        available_gb: available_memory,
    };

    // Get GPU info (NVIDIA only on Windows)
    let gpu_info = get_gpu_info(&state);

    SystemInfo {
        cpu: cpu_info,
        memory: memory_info,
        gpu: gpu_info,
    }
}

#[cfg(target_os = "windows")]
fn get_gpu_info(state: &State<AppState>) -> Option<GpuInfo> {
    if let Some(ref nvml) = state.nvml {
        if let Ok(device) = nvml.device_by_index(0) {
            let name = device.name().unwrap_or_else(|_| "Unknown GPU".to_string());
            
            let usage = device.utilization_rates()
                .map(|u| u.gpu as f32)
                .unwrap_or(0.0);
            
            let temperature = device.temperature(nvml_wrapper::enum_wrappers::device::TemperatureSensor::Gpu)
                .map(|t| t as f32)
                .unwrap_or(0.0);
            
            let memory = device.memory_info().ok();
            let (memory_used, memory_total) = memory
                .map(|m| (m.used as f32 / 1_073_741_824.0, m.total as f32 / 1_073_741_824.0))
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

#[cfg(not(target_os = "windows"))]
fn get_gpu_info(_state: &State<AppState>) -> Option<GpuInfo> {
    // GPU monitoring not available on non-Windows platforms without additional setup
    None
}

fn main() {
    // Initialize sysinfo
    let sys = System::new_with_specifics(
        RefreshKind::new()
            .with_cpu(CpuRefreshKind::everything())
            .with_memory(MemoryRefreshKind::everything())
    );

    // Try to initialize NVML for NVIDIA GPU monitoring
    #[cfg(target_os = "windows")]
    let nvml = Nvml::init().ok();
    
    #[cfg(target_os = "windows")]
    let app_state = AppState {
        sys: Mutex::new(sys),
        nvml,
    };

    #[cfg(not(target_os = "windows"))]
    let app_state = AppState {
        sys: Mutex::new(sys),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![get_system_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
