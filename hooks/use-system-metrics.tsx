"use client"

import { useEffect, useState, useCallback } from "react"
import { Cpu, HardDrive, MemoryStick, Monitor } from "lucide-react"
import { isTauri, getSystemInfo, startSensorService, type SystemInfo } from "@/lib/tauri"

export interface MetricSensor {
  label: string
  value: number
  temp: number | null
  icon: React.ReactNode
  subtitle: string
}

function generateMockData(prev: MetricSensor[]): MetricSensor[] {
  return prev.map((sensor) => ({
    ...sensor,
    value: Math.min(100, Math.max(10, sensor.value + (Math.random() - 0.5) * 8)),
    temp:
      sensor.temp !== null
        ? Math.min(85, Math.max(35, sensor.temp + (Math.random() - 0.5) * 3))
        : null,
  }))
}

export function systemInfoToMetrics(info: SystemInfo): MetricSensor[] {
  const sensors: MetricSensor[] = [
    {
      label: "CPU",
      value: info.cpu.usage,
      temp: info.cpu.temperature,
      icon: <Cpu className="h-4 w-4" />,
      subtitle: info.cpu.name.length > 28 ? `${info.cpu.name.substring(0, 28)}…` : info.cpu.name,
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
      subtitle: info.gpu.name.length > 28 ? `${info.gpu.name.substring(0, 28)}…` : info.gpu.name,
    })
  }

  if (info.disk) {
    sensors.push({
      label: "DISK",
      value: info.disk.usage_percent,
      temp: null,
      icon: <HardDrive className="h-4 w-4" />,
      subtitle: `${info.disk.used_gb.toFixed(0)} / ${info.disk.total_gb.toFixed(0)} GB`,
    })
  }

  return sensors
}

const SENSOR_WARMUP_MS = 2_000

export function useSystemMetrics() {
  const [isRunningInTauri] = useState(() => (typeof window !== "undefined" ? isTauri() : false))
  const [cpuTempReady, setCpuTempReady] = useState(false)
  const [sensorWarmup, setSensorWarmup] = useState(true)
  const [activating, setActivating] = useState(false)
  const [activationFailed, setActivationFailed] = useState(false)
  const [activationError, setActivationError] = useState<string | null>(null)
  const [sensors, setSensors] = useState<MetricSensor[]>([
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
    {
      label: "DISK",
      value: 54,
      temp: null,
      icon: <HardDrive className="h-4 w-4" />,
      subtitle: "512 / 953 GB",
    },
  ])

  useEffect(() => {
    const timer = setTimeout(() => setSensorWarmup(false), SENSOR_WARMUP_MS)
    return () => clearTimeout(timer)
  }, [])

  const fetchSystemInfo = useCallback(async () => {
    if (!isRunningInTauri) return
    try {
      const info = await getSystemInfo()
      const next = systemInfoToMetrics(info)
      setSensors(next)
      const cpuOk = info.cpu.temperature != null && info.cpu.temperature > 0
      setCpuTempReady(cpuOk)
      if (cpuOk) setSensorWarmup(false)
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

  const cpuMissingTemp = isRunningInTauri && !cpuTempReady && !sensorWarmup

  const handleEnableSensors = useCallback(async () => {
    setActivating(true)
    setActivationFailed(false)
    setActivationError(null)
    try {
      await startSensorService()
      const info = await getSystemInfo()
      const next = systemInfoToMetrics(info)
      setSensors(next)
      const cpuOk = info.cpu.temperature != null && info.cpu.temperature > 0
      setCpuTempReady(cpuOk)
      if (!cpuOk) {
        setActivationFailed(true)
        setActivationError("sensor_timeout")
      }
    } catch (error) {
      setActivationFailed(true)
      const raw =
        error instanceof Error ? error.message : typeof error === "string" ? error : String(error)
      setActivationError(raw)
    } finally {
      setActivating(false)
    }
  }, [])

  return {
    sensors,
    isRunningInTauri,
    cpuMissingTemp,
    sensorWarmup,
    cpuTempReady,
    activating,
    activationFailed,
    activationError,
    handleEnableSensors,
  }
}
