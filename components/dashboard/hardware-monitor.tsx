"use client"

import { useEffect, useState } from "react"
import { Cpu, MemoryStick, Monitor } from "lucide-react"

interface SensorData {
  label: string
  value: number
  temp: number
  icon: React.ReactNode
  subtitle: string
}

export function HardwareMonitor() {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => ({
          ...sensor,
          value: Math.min(100, Math.max(10, sensor.value + (Math.random() - 0.5) * 8)),
          temp: Math.min(85, Math.max(35, sensor.temp + (Math.random() - 0.5) * 3)),
        }))
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">
          System Status
        </h2>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-soft" />
          <span className="text-xs text-white/40">Live</span>
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
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-amber-400 font-mono">
                  {Math.round(sensor.temp)}°C
                </span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full progress-gradient transition-all duration-500 ease-out"
                style={{ width: `${sensor.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
