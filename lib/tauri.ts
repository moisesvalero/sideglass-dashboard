export interface CpuInfo {
  name: string
  usage: number
  temperature: number | null
  cores: number
  frequency: number
}

export interface MemoryInfo {
  total_gb: number
  used_gb: number
  usage_percent: number
  available_gb: number
}

export interface GpuInfo {
  name: string
  usage: number
  temperature: number | null
  memory_used_gb: number
  memory_total_gb: number
  memory_percent: number
}

export interface SystemInfo {
  cpu: CpuInfo
  memory: MemoryInfo
  gpu: GpuInfo | null
  sensors_available: boolean
}

export const isTauri = (): boolean => {
  return typeof window !== "undefined" && "__TAURI__" in window
}

async function getTauriCore() {
  if (!isTauri()) return null
  // @ts-expect-error Tauri global
  return window.__TAURI__.core as {
    invoke: <T>(cmd: string, args?: Record<string, unknown>) => Promise<T>
  }
}

export async function invokeCommand<T>(
  command: string,
  args?: Record<string, unknown>
): Promise<T> {
  const core = await getTauriCore()
  if (!core) throw new Error("Not running in Tauri environment")
  return core.invoke<T>(command, args)
}

export async function getSystemInfo(): Promise<SystemInfo> {
  return invokeCommand<SystemInfo>("get_system_info")
}

export async function fetchIcal(url: string): Promise<string> {
  return invokeCommand<string>("fetch_ical", { url })
}

export async function openExternalUrl(url: string): Promise<void> {
  if (isTauri()) {
    await invokeCommand("open_url", { url })
    return
  }
  window.open(url, "_blank", "noopener,noreferrer")
}

export async function toggleDashboardWindow(): Promise<void> {
  if (!isTauri()) return
  await invokeCommand("toggle_main_window")
}

export async function setAutostart(enabled: boolean): Promise<void> {
  if (!isTauri()) return
  await invokeCommand("set_autostart", { enabled })
}

export async function registerGlobalHotkey(accelerator: string): Promise<void> {
  if (!isTauri()) return
  await invokeCommand("register_global_hotkey", { accelerator })
}

export async function checkForUpdates(): Promise<string> {
  if (!isTauri()) return "no_tauri"
  return invokeCommand<string>("check_for_updates")
}
