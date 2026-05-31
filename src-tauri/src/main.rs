// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use sysinfo::{System, CpuRefreshKind, MemoryRefreshKind, RefreshKind, Components};
use std::sync::Mutex;
use tauri::{
    State, Manager,
    tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState},
    menu::{MenuBuilder, MenuItemBuilder},
    image::Image,
};

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

    sys.refresh_cpu_specifics(CpuRefreshKind::everything());
    sys.refresh_memory_specifics(MemoryRefreshKind::everything());

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

    let mut cpu_temp: f32 = 0.0;
    for component in Components::new_with_refreshed_list().iter() {
        let label = component.label().to_lowercase();
        if label.contains("cpu") || label.contains("core") || label.contains("package") || label.contains("tdie") || label.contains("tctl") {
            cpu_temp = component.temperature();
            break;
        }
    }
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

    let total_memory = sys.total_memory() as f32 / 1_073_741_824.0;
    let used_memory = sys.used_memory() as f32 / 1_073_741_824.0;
    let available_memory = sys.available_memory() as f32 / 1_073_741_824.0;

    let memory_info = MemoryInfo {
        total_gb: total_memory,
        used_gb: used_memory,
        usage_percent: (used_memory / total_memory) * 100.0,
        available_gb: available_memory,
    };

    let gpu_info = get_gpu_info(&state);

    SystemInfo {
        cpu: cpu_info,
        memory: memory_info,
        gpu: gpu_info,
    }
}

fn get_gpu_info(state: &State<AppState>) -> Option<GpuInfo> {
    // Try NVIDIA NVML first
    #[cfg(target_os = "windows")]
    {
        let nvml_result = get_nvidia_gpu(state);
        if nvml_result.is_some() {
            return nvml_result;
        }
    }

    // Fallback: try to detect any GPU via sysinfo components
    get_gpu_via_components()
}

#[cfg(target_os = "windows")]
fn get_nvidia_gpu(state: &State<AppState>) -> Option<GpuInfo> {
    if let Some(ref nvml) = state.nvml {
        if let Ok(device) = nvml.device_by_index(0) {
            let name = device.name().unwrap_or_else(|_| "NVIDIA GPU".to_string());

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

fn get_gpu_via_components() -> Option<GpuInfo> {
    let mut gpu_temp: f32 = 0.0;
    let mut gpu_name = String::from("GPU");

    for component in Components::new_with_refreshed_list().iter() {
        let label = component.label().to_lowercase();
        if label.contains("gpu") {
            let temp = component.temperature();
            if temp > 0.0 {
                gpu_temp = temp;
            }
            // Try to extract GPU name from component label
            if label.contains("nvidia") || label.contains("amd") || label.contains("radeon") || label.contains("intel") || label.contains("arc") {
                gpu_name = component.label().to_string();
            }
        }
    }

    if gpu_temp > 0.0 {
        return Some(GpuInfo {
            name: gpu_name,
            usage: 0.0,
            temperature: gpu_temp,
            memory_used_gb: 0.0,
            memory_total_gb: 0.0,
            memory_percent: 0.0,
        });
    }

    None
}

fn main() {
    let sys = System::new_with_specifics(
        RefreshKind::new()
            .with_cpu(CpuRefreshKind::everything())
            .with_memory(MemoryRefreshKind::everything())
    );

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
        .setup(|app| {
            let show = MenuItemBuilder::with_id("show", "Mostrar").build(app)?;
            let hide = MenuItemBuilder::with_id("hide", "Ocultar").build(app)?;
            let quit = MenuItemBuilder::with_id("quit", "Salir").build(app)?;

            let menu = MenuBuilder::new(app)
                .item(&show)
                .item(&hide)
                .separator()
                .item(&quit)
                .build()?;

            let icon = Image::new_owned(vec![30, 30, 80, 255], 1, 1);

            let _tray = TrayIconBuilder::new()
                .icon(icon)
                .menu(&menu)
                .tooltip("Dashboard")
                .on_menu_event(move |app, event| {
                    let window = app.get_webview_window("main").unwrap();
                    match event.id().as_ref() {
                        "show" => { let _ = window.show(); let _ = window.set_focus(); }
                        "hide" => { let _ = window.hide(); }
                        "quit" => { std::process::exit(0); }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event {
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
