"use client"

import { useEffect, useState, useCallback } from "react"
import { Cpu, MemoryStick, Monitor } from "lucide-react"
import { isTauri, getSystemInfo, type SystemInfo } from "@/lib/tauri"
import { useI18n } from "@/lib/i18n"

interface SensorData {
  label: string
  value: number
  temp: number | null
  icon: React.ReactNode
  subtitle: string
}

function generateMockData(prev: SensorData[]): SensorData[] {
  return prev.map((sensor) => ({
    ...sensor,
    value: Math.min(100, Math.max(10, sensor.value + (Math.random() - 0.5) * 8)),
    temp:
      sensor.temp !== null
        ? Math.min(85, Math.max(35, sensor.temp + (Math.random() - 0.5) * 3))
        : null,
  }))
}

function systemInfoToSensors(info: SystemInfo): SensorData[] {
  const sensors: SensorData[] = [
    {
      label: "CPU",
      value: info.cpu.usage,
      temp: info.cpu.temperature,
      icon: <Cpu className="w-4 h-4" />,
      subtitle: info.cpu.name.length > 22 ? `${info.cpu.name.substring(0, 22)}…` : info.cpu.name,
    },
    {
      label: "RAM",
      value: info.memory.usage_percent,
      temp: null,
      icon: <MemoryStick className="w-4 h-4" />,
      subtitle: `${info.memory.used_gb.toFixed(1)} / ${info.memory.total_gb.toFixed(0)} GB`,
    },
  ]

  if (info.gpu) {
    sensors.push({
      label: "GPU",
      value: info.gpu.usage,
      temp: info.gpu.temperature,
      icon: <Monitor className="w-4 h-4" />,
      subtitle: info.gpu.name.length > 22 ? `${info.gpu.name.substring(0, 22)}…` : info.gpu.name,
    })
  }

  return sensors
}

export function HardwareMonitor() {
  const [isRunningInTauri] = useState(() => (typeof window !== "undefined" ? isTauri() : false))
  const [sensorsAvailable, setSensorsAvailable] = useState(false)
  const [sensors, setSensors] = useState<SensorData[]>([
    { label: "CPU", value: 42, temp: null, icon: <Cpu className="w-4 h-4" />, subtitle: "CPU" },
    {
      label: "RAM",
      value: 67,
      temp: null,
      icon: <MemoryStick className="w-4 h-4" />,
      subtitle: "21.4 / 32 GB",
    },
    {
      label: "GPU",
      value: 38,
      temp: null,
      icon: <Monitor className="w-4 h-4" />,
      subtitle: "GPU",
    },
  ])
  const { t } = useI18n()

  const fetchSystemInfo = useCallback(async () => {
    if (!isRunningInTauri) return
    try {
      const info = await getSystemInfo()
      setSensors(systemInfoToSensors(info))
      setSensorsAvailable(info.sensors_available)
    } catch (error) {
      console.error("Error fetching system info:", error)
    }
  }, [isRunningInTauri])

  useEffect(() => {
    if (isRunningInTauri) {
      fetchSystemInfo()
      const interval = setInterval(fetchSystemInfo, 2000)
      return () => clearInterval(interval)
    }

    const interval = setInterval(() => {
      setSensors((prev) => generateMockData(prev))
    }, 2000)
    return () => clearInterval(interval)
  }, [fetchSystemInfo, isRunningInTauri])

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="widget-title">{t("hardware.title")}</h2>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-soft" />
          <span className="text-xs text-muted-foreground">
            {isRunningInTauri ? t("hardware.live") : t("hardware.demo")}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {sensors.map((sensor) => (
          <div key={sensor.label} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="text-muted-foreground">{sensor.icon}</div>
                <div className="min-w-0">
                  <span className="text-foreground text-sm font-medium">{sensor.label}</span>
                  <p className="text-muted-foreground text-xs truncate">{sensor.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-foreground font-mono text-sm tabular-nums">
                  {Math.round(sensor.value)}%
                </span>
                {sensor.temp !== null && sensor.temp > 0 ? (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md bg-muted font-mono tabular-nums ${
                      sensor.temp > 80
                        ? "text-red-500"
                        : sensor.temp > 65
                          ? "text-amber-500"
                          : "text-emerald-500"
                    }`}
                  >
                    {Math.round(sensor.temp)}°C
                  </span>
                ) : isRunningInTauri && sensor.label !== "RAM" ? (
                  <span className="text-[10px] text-muted-foreground">{t("hardware.noTemp")}</span>
                ) : null}
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  sensor.value > 90
                    ? "bg-gradient-to-r from-red-500 to-red-400"
                    : sensor.value > 75
                      ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                      : "progress-gradient"
                }`}
                style={{ width: `${sensor.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {isRunningInTauri && !sensorsAvailable && (
        <p className="text-muted-foreground text-xs mt-4 text-center">{t("hardware.lhmHint")}</p>
      )}
      {!isRunningInTauri && (
        <p className="text-muted-foreground text-xs mt-4 text-center">{t("hardware.tauriHint")}</p>
      )}
    </div>
  )
}
