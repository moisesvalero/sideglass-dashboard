"use client"

import { useEffect, useState, useCallback } from "react"
import { Cpu, MemoryStick, Monitor } from "lucide-react"
import { isTauri, getSystemInfo, startSensorService, type SystemInfo } from "@/lib/tauri"
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
      icon: <Cpu className="h-4 w-4" />,
      subtitle: info.cpu.name.length > 22 ? `${info.cpu.name.substring(0, 22)}…` : info.cpu.name,
    },
    {
      label: "RAM",
      value: info.memory.usage_percent,
      temp: null,
      icon: <MemoryStick className="h-4 w-4" />,
      subtitle: `${info.memory.used_gb.toFixed(1)} / ${info.memory.total_gb.toFixed(0)} GB`,
    },
  ]

  if (info.gpu) {
    sensors.push({
      label: "GPU",
      value: info.gpu.usage,
      temp: info.gpu.temperature,
      icon: <Monitor className="h-4 w-4" />,
      subtitle: info.gpu.name.length > 22 ? `${info.gpu.name.substring(0, 22)}…` : info.gpu.name,
    })
  }

  return sensors
}

const SENSOR_WARMUP_MS = 25_000

export function HardwareMonitor() {
  const [isRunningInTauri] = useState(() => (typeof window !== "undefined" ? isTauri() : false))
  const [sensorsAvailable, setSensorsAvailable] = useState(false)
  const [sensorWarmup, setSensorWarmup] = useState(true)
  const [activating, setActivating] = useState(false)
  const [activationFailed, setActivationFailed] = useState(false)
  const [sensors, setSensors] = useState<SensorData[]>([
    { label: "CPU", value: 42, temp: null, icon: <Cpu className="h-4 w-4" />, subtitle: "CPU" },
    {
      label: "RAM",
      value: 67,
      temp: null,
      icon: <MemoryStick className="h-4 w-4" />,
      subtitle: "21.4 / 32 GB",
    },
    {
      label: "GPU",
      value: 38,
      temp: null,
      icon: <Monitor className="h-4 w-4" />,
      subtitle: "GPU",
    },
  ])
  const { t } = useI18n()

  useEffect(() => {
    const timer = setTimeout(() => setSensorWarmup(false), SENSOR_WARMUP_MS)
    return () => clearTimeout(timer)
  }, [])

  const fetchSystemInfo = useCallback(async () => {
    if (!isRunningInTauri) return
    try {
      const info = await getSystemInfo()
      setSensors(systemInfoToSensors(info))
      setSensorsAvailable(info.sensors_available)
      if (info.sensors_available) setSensorWarmup(false)
    } catch (error) {
      console.error("Error fetching system info:", error)
    }
  }, [isRunningInTauri])

  useEffect(() => {
    if (isRunningInTauri) {
      void fetchSystemInfo()
      const interval = setInterval(fetchSystemInfo, 2000)
      return () => clearInterval(interval)
    }

    const interval = setInterval(() => {
      setSensors((prev) => generateMockData(prev))
    }, 2000)
    return () => clearInterval(interval)
  }, [fetchSystemInfo, isRunningInTauri])

  const showSensorWarning = isRunningInTauri && !sensorsAvailable && !sensorWarmup

  const handleEnableSensors = useCallback(async () => {
    setActivating(true)
    setActivationFailed(false)
    try {
      const ok = await startSensorService()
      if (ok) {
        setSensorsAvailable(true)
        await fetchSystemInfo()
      } else {
        setActivationFailed(true)
      }
    } catch {
      setActivationFailed(true)
    } finally {
      setActivating(false)
    }
  }, [fetchSystemInfo])

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="widget-title">{t("hardware.title")}</h2>
        <div className="flex items-center gap-1.5">
          <span className="pulse-soft h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">
            {isRunningInTauri ? t("hardware.live") : t("hardware.demo")}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {sensors.map((sensor) => (
          <div key={sensor.label} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div className="text-muted-foreground">{sensor.icon}</div>
                <div className="min-w-0">
                  <span className="text-sm font-medium text-foreground">{sensor.label}</span>
                  <p className="truncate text-xs text-muted-foreground">{sensor.subtitle}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-mono text-sm tabular-nums text-foreground">
                  {Math.round(sensor.value)}%
                </span>
                {sensor.temp !== null && sensor.temp > 0 ? (
                  <span
                    className={`rounded-md bg-muted px-2 py-0.5 font-mono text-xs tabular-nums ${
                      sensor.temp > 80
                        ? "text-red-500"
                        : sensor.temp > 65
                          ? "text-amber-500"
                          : "text-emerald-500"
                    }`}
                  >
                    {Math.round(sensor.temp)}°C
                  </span>
                ) : null}
              </div>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
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

      {isRunningInTauri && sensorWarmup && !sensorsAvailable && (
        <p className="mt-4 text-center text-xs text-muted-foreground">{t("hardware.sensorsLoading")}</p>
      )}
      {showSensorWarning && (
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => void handleEnableSensors()}
            disabled={activating}
            className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {activating ? t("hardware.enablingSensors") : t("hardware.enableSensors")}
          </button>
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            {activationFailed ? t("hardware.sensorsFailed") : t("hardware.sensorsHint")}
          </p>
        </div>
      )}
      {!isRunningInTauri && (
        <p className="mt-4 text-center text-xs text-muted-foreground">{t("hardware.tauriHint")}</p>
      )}
    </div>
  )
}
