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

export type TauriWindowHandle = {
  minimize: () => Promise<void>
  toggleMaximize: () => Promise<void>
  close: () => Promise<void>
  setFullscreen: (fullscreen: boolean) => Promise<void>
  isFullscreen: () => Promise<boolean>
}

export async function getCurrentTauriWindow(): Promise<TauriWindowHandle | null> {
  try {
    if (!isTauri()) return null
    // @ts-expect-error Tauri global
    const { getCurrentWindow } = window.__TAURI__.window
    return getCurrentWindow() as TauriWindowHandle
  } catch {
    return null
  }
}

export async function toggleFullscreen(): Promise<void> {
  const win = await getCurrentTauriWindow()
  if (!win) return
  const fullscreen = await win.isFullscreen()
  await win.setFullscreen(!fullscreen)
}

export interface UpdateInfo {
  available: boolean
  version: string
  notes: string
}

export interface UpdateProgress {
  downloaded: number
  total: number
  percent: number
  indeterminate: boolean
}

export async function checkForUpdates(): Promise<UpdateInfo> {
  if (!isTauri()) return { available: false, version: "", notes: "" }
  const timeout = new Promise<UpdateInfo>((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), 30_000)
  )
  return Promise.race([invokeCommand<UpdateInfo>("check_for_updates"), timeout])
}

export async function installUpdate(): Promise<string> {
  if (!isTauri()) return "no_tauri"
  const timeout = new Promise<string>((_, reject) =>
    setTimeout(() => reject(new Error("timeout (5 min)")), 300_000)
  )
  return Promise.race([invokeCommand<string>("install_update"), timeout])
}

export async function dismissPendingUpdate(): Promise<void> {
  if (!isTauri()) return
  await invokeCommand("dismiss_pending_update")
}

export async function restartApp(): Promise<void> {
  if (!isTauri()) return
  await invokeCommand("restart_app")
}

/** User-initiated activation of the CPU/GPU sensor service (triggers UAC). */
export async function startSensorService(): Promise<boolean> {
  if (!isTauri()) return false
  return invokeCommand<boolean>("start_sensor_service")
}

type UnlistenFn = () => void

async function getTauriEvent() {
  if (!isTauri()) return null
  // @ts-expect-error Tauri global
  return window.__TAURI__.event as {
    listen: <T>(event: string, handler: (e: { payload: T }) => void) => Promise<UnlistenFn>
  }
}

export async function onUpdateProgress(
  handler: (progress: UpdateProgress) => void
): Promise<UnlistenFn> {
  const ev = await getTauriEvent()
  if (!ev) return () => {}
  return ev.listen<UpdateProgress>("update://progress", (e) => handler(e.payload))
}

export async function onUpdateFinished(handler: () => void): Promise<UnlistenFn> {
  const ev = await getTauriEvent()
  if (!ev) return () => {}
  return ev.listen("update://finished", () => handler())
}

export interface YoutubeResult {
  id: string
  title: string
  channel: string
  thumbnail: string
}

export async function youtubeSearch(query: string): Promise<YoutubeResult[]> {
  if (!isTauri()) return []
  return invokeCommand<YoutubeResult[]>("youtube_search", { query })
}
