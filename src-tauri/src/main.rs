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

struct AppState {
    sys: Mutex<System>,
    #[cfg(target_os = "windows")]
    nvml: Option<Nvml>,
    lhm_started: Mutex<bool>,
}

#[cfg(windows)]
use std::os::windows::process::CommandExt;

#[cfg(windows)]
fn try_start_lhm(app: &tauri::AppHandle) {
    let state = app.state::<AppState>();
    let mut guard = state.lhm_started.lock().unwrap();
    if *guard {
        return;
    }

    // If sensors are already exposed (e.g. LHM left running), skip launching.
    if read_lhm_temperatures().2 {
        *guard = true;
        return;
    }

    if let Ok(resource_dir) = app.path().resource_dir() {
        let candidates = [
            resource_dir.join("bin").join("LibreHardwareMonitor.exe"),
            resource_dir.join("LibreHardwareMonitor.exe"),
        ];
        for path in candidates {
            if path.exists() {
                // LibreHardwareMonitor needs administrator rights to expose the
                // CPU package temperature over WMI. Launch it elevated (one UAC
                // prompt); fall back to a normal launch if elevation is refused.
                let path_str = path.to_string_lossy().replace('\'', "''");
                let elevated = std::process::Command::new("powershell")
                    .args([
                        "-NoProfile",
                        "-WindowStyle",
                        "Hidden",
                        "-Command",
                        &format!(
                            "Start-Process -FilePath '{path_str}' -ArgumentList '--minimize' -Verb RunAs -WindowStyle Hidden"
                        ),
                    ])
                    .creation_flags(0x08000000) // CREATE_NO_WINDOW
                    .spawn();

                if elevated.is_err() {
                    let work_dir = path.parent().unwrap_or_else(|| path.as_path());
                    let _ = std::process::Command::new(&path)
                        .current_dir(work_dir)
                        .arg("--minimize")
                        .creation_flags(0x08000000)
                        .spawn();
                }

                *guard = true;
                for _ in 0..15 {
                    std::thread::sleep(std::time::Duration::from_secs(1));
                    let (_, _, ok) = read_lhm_temperatures();
                    if ok {
                        return;
                    }
                }
                return;
            }
        }
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

    let results: Vec<HashMap<String, wmi::Variant>> = match wmi_con
        .raw_query("SELECT Name, Value, SensorType FROM Sensor WHERE SensorType = 'Temperature'")
    {
        Ok(r) => r,
        Err(_) => return (None, None, false),
    };

    if results.is_empty() {
        return (None, None, false);
    }

    let mut cpu_temp: Option<f32> = None;
    let mut gpu_temp: Option<f32> = None;

    for row in &results {
        let name = row
            .get("Name")
            .map(variant_to_string)
            .unwrap_or_default()
            .to_lowercase();
        let value: f32 = row.get("Value").and_then(variant_to_f32).unwrap_or(0.0);

        if value <= 0.0 || value > 120.0 {
            continue;
        }

        if cpu_temp.is_none()
            && (name.contains("cpu package")
                || name.contains("cpu core")
                || name.contains("tctl")
                || name.contains("tdie")
                || (name.contains("cpu") && name.contains("temperature")))
        {
            cpu_temp = Some(value);
        }

        if gpu_temp.is_none()
            && (name.contains("gpu core")
                || name.contains("graphics")
                || name.contains("gpu hotspot")
                || (name.contains("gpu") && name.contains("temperature")))
        {
            gpu_temp = Some(value);
        }
    }

    for row in &results {
        let name = row
            .get("Name")
            .map(variant_to_string)
            .unwrap_or_default()
            .to_lowercase();
        let value: f32 = row.get("Value").and_then(variant_to_f32).unwrap_or(0.0);
        if value <= 0.0 || value > 120.0 {
            continue;
        }
        if cpu_temp.is_none() && name.contains("cpu") && !name.contains("gpu") {
            cpu_temp = Some(value);
        }
        if gpu_temp.is_none() && name.contains("gpu") {
            gpu_temp = Some(value);
        }
    }

    let available = cpu_temp.is_some() || gpu_temp.is_some();
    (cpu_temp, gpu_temp, available)
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

    let (lhm_cpu_temp, lhm_gpu_temp, mut sensors_available) = read_lhm_temperatures();
    let cpu_temp = lhm_cpu_temp.or_else(cpu_temp_from_components);

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
    if cpu_temp.is_some() || lhm_gpu_temp.is_some() {
        sensors_available = true;
    }
    if gpu_info
        .as_ref()
        .and_then(|g| g.temperature)
        .filter(|t| *t > 0.0)
        .is_some()
    {
        sensors_available = true;
    }

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

#[tauri::command]
async fn check_for_updates(app: tauri::AppHandle) -> Result<String, String> {
    use tauri_plugin_updater::UpdaterExt;

    let updater = app
        .updater_builder()
        .timeout(std::time::Duration::from_secs(20))
        .build()
        .map_err(|e| e.to_string())?;
    match updater.check().await.map_err(|e| e.to_string())? {
        Some(update) => {
            update
                .download_and_install(|_chunk, _total| {}, || {})
                .await
                .map_err(|e| e.to_string())?;
            Ok(format!("updated_to_{}", update.version))
        }
        None => Ok("no_update".to_string()),
    }
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
    };

    #[cfg(not(target_os = "windows"))]
    let app_state = AppState {
        sys: Mutex::new(sys),
        lhm_started: Mutex::new(false),
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
        ])
        .setup(|app| {
            // Start the sensor service in the background so the window shows
            // immediately and the elevation prompt does not block startup.
            #[cfg(windows)]
            {
                let handle = app.handle().clone();
                std::thread::spawn(move || {
                    try_start_lhm(&handle);
                });
            }

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
