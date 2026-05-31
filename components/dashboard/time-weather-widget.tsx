"use client"

import { useEffect, useState } from "react"
import { Sun } from "lucide-react"

export function TimeWeatherWidget() {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setMounted(true)
    setTime(new Date())
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="glass-card p-6 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-6xl font-light tracking-tight text-white tabular-nums">
          {mounted && time ? formatTime(time) : "--:--"}
        </span>
        <span className="text-lg text-white/60 mt-1">
          {mounted && time ? formatDate(time) : "Loading..."}
        </span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Sun className="w-16 h-16 text-amber-400 weather-glow float-animation" />
          <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-light text-white">24°</span>
          <span className="text-white/50 text-sm">Sunny</span>
        </div>
      </div>
    </div>
  )
}
