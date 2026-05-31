"use client"

import { useEffect, useState, useCallback } from "react"
import { Cpu, MemoryStick, Monitor } from "lucide-react"
import { isTauri, getSystemInfo, type SystemInfo } from "@/lib/tauri"

interface SensorData {
  label: string
  value: number
  temp: number
  icon: React.ReactNode
  subtitle: string
}

// Mock data generator for web preview
function generateMockData(prev: SensorData[]): SensorData[] {
  return prev.map((sensor) => ({
    ...sensor,
    value: Math.min(100, Math.max(10, sensor.value + (Math.random() - 0.5) * 8)),
    temp: Math.min(85, Math.max(35, sensor.temp + (Math.random() - 0.5) * 3)),
  }))
}

// Convert SystemInfo from Tauri to SensorData array
function systemInfoToSensors(info: SystemInfo): SensorData[] {
  const sensors: SensorData[] = [
    {
      label: "CPU",
      value: info.cpu.usage,
      temp: info.cpu.temperature,
      icon: <Cpu className="w-4 h-4" />,
      subtitle: info.cpu.name.length > 20 
        ? info.cpu.name.substring(0, 20) + "..." 
        : info.cpu.name,
    },
    {
      label: "RAM",
      value: info.memory.usage_percent,
      temp: 0, // RAM doesn't have temperature
      icon: <MemoryStick className="w-4 h-4" />,
      subtitle: `${info.memory.used_gb.toFixed(1)} / ${info.memory.total_gb.toFixed(0)} GB`,
    },
  ]

  // Add GPU if available
  if (info.gpu) {
    sensors.push({
      label: "GPU",
      value: info.gpu.usage,
      temp: info.gpu.temperature,
      icon: <Monitor className="w-4 h-4" />,
      subtitle: info.gpu.name.length > 20 
        ? info.gpu.name.substring(0, 20) + "..." 
        : info.gpu.name,
    })
  }

  return sensors
}

export function HardwareMonitor() {
  const [isRunningInTauri, setIsRunningInTauri] = useState(false)
  const [sensors, setSensors] = useState<SensorData[]>([
    {
      label: "CPU",
      value: 42,
      temp: 54,
      icon: <Cpu className="w-4 h-4" />,
      subtitle: "Intel Core i9",
    },
    {
      label: "RAM",
      value: 67,
      temp: 45,
      icon: <MemoryStick className="w-4 h-4" />,
      subtitle: "21.4 / 32 GB",
    },
    {
      label: "GPU",
      value: 38,
      temp: 62,
      icon: <Monitor className="w-4 h-4" />,
      subtitle: "RTX 4090",
    },
  ])

  const fetchSystemInfo = useCallback(async () => {
    if (!isRunningInTauri) return

    try {
      const info = await getSystemInfo()
      setSensors(systemInfoToSensors(info))
    } catch (error) {
      console.error("[v0] Error fetching system info:", error)
    }
  }, [isRunningInTauri])

  useEffect(() => {
    // Check if running in Tauri on mount
    const tauriMode = isTauri()
    setIsRunningInTauri(tauriMode)

    if (tauriMode) {
      // Running in Tauri - fetch real system data
      fetchSystemInfo()
      const interval = setInterval(fetchSystemInfo, 1500)
      return () => clearInterval(interval)
    } else {
      // Running in browser - use mock data
      const interval = setInterval(() => {
        setSensors((prev) => generateMockData(prev))
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [fetchSystemInfo])

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">
          System Status
        </h2>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-soft" />
          <span className="text-xs text-white/40">
            {isRunningInTauri ? "Live" : "Demo"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {sensors.map((sensor) => (
          <div key={sensor.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-white/60">{sensor.icon}</div>
                <div>
                  <span className="text-white text-sm font-medium">{sensor.label}</span>
                  <p className="text-white/40 text-xs">{sensor.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-mono text-sm">
                  {Math.round(sensor.value)}%
                </span>
                {sensor.temp > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-white/10 font-mono ${
                    sensor.temp > 80 ? "text-red-400" : 
                    sensor.temp > 65 ? "text-amber-400" : 
                    "text-emerald-400"
                  }`}>
                    {Math.round(sensor.temp)}°C
                  </span>
                )}
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  sensor.value > 90 ? "bg-gradient-to-r from-red-500 to-red-400" :
                  sensor.value > 75 ? "bg-gradient-to-r from-amber-500 to-yellow-400" :
                  "progress-gradient"
                }`}
                style={{ width: `${sensor.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {!isRunningInTauri && (
        <p className="text-white/30 text-xs mt-4 text-center">
          Run with Tauri for real hardware data
        </p>
      )}
    </div>
  )
}
