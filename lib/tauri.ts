// Type definitions for Tauri commands
// These match the Rust structs in src-tauri/src/main.rs

export interface CpuInfo {
  name: string
  usage: number
  temperature: number
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
  temperature: number
  memory_used_gb: number
  memory_total_gb: number
  memory_percent: number
}

export interface SystemInfo {
  cpu: CpuInfo
  memory: MemoryInfo
  gpu: GpuInfo | null
}

// Check if running in Tauri
export const isTauri = (): boolean => {
  return typeof window !== "undefined" && "__TAURI__" in window
}

// Invoke Tauri command with type safety
export async function invokeCommand<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  if (!isTauri()) {
    throw new Error("Not running in Tauri environment")
  }
  
  // @ts-expect-error - Tauri global is injected at runtime
  const { invoke } = window.__TAURI__.core
  return invoke(command, args)
}

// Get system information from Tauri backend
export async function getSystemInfo(): Promise<SystemInfo> {
  return invokeCommand<SystemInfo>("get_system_info")
}
