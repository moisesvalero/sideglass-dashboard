"use client"

import { useEffect, useState, useCallback } from "react"
import { Calendar, Loader2, Link } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useSettings } from "@/lib/settings"

interface CalendarEvent {
  id: string
  title: string
  time: string
  date: string
  color: string
}

const eventColors = [
  "bg-[#FF3B30]",
  "bg-[#007AFF]",
  "bg-[#34C759]",
  "bg-[#FF9500]",
  "bg-[#AF52DE]",
  "bg-[#5AC8FA]",
  "bg-[#FF2D55]",
]

export function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)
  const { t } = useI18n()
  const { settings, updateSettings } = useSettings()

  const calendarUrl = settings.calendarScriptUrl || ""

  const formatDate = (d: Date) => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const isToday = d.toDateString() === now.toDateString()
    const isTomorrow = d.toDateString() === tomorrow.toDateString()

    if (isToday) return "Hoy"
    if (isTomorrow) return "Manana"
    return d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })
  }

  const fetchCalendarEvents = useCallback(async () => {
    if (!calendarUrl) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch(calendarUrl, {
        signal: AbortSignal.timeout(8000),
      })

      if (!res.ok) {
        setLoading(false)
        return
      }

      const contentType = res.headers.get("content-type") || ""
      const text = await res.text()

      if (!contentType.includes("json") && !text.startsWith("[")) {
        setLoading(false)
        return
      }

      const data = JSON.parse(text)
      if (!Array.isArray(data) || !data.length) {
        setEvents([])
        setIsLive(true)
        setLoading(false)
        return
      }

      const now = new Date().getTime()

      const parsed: CalendarEvent[] = data
        .filter((e: { start: string; end: string }) => {
          const eventEnd = new Date(e.end).getTime()
          return eventEnd > now
        })
        .sort((a: { start: string }, b: { start: string }) =>
          new Date(a.start).getTime() - new Date(b.start).getTime()
        )
        .slice(0, 4)
        .map((e: { title: string; start: string }, i: number) => {
          const d = new Date(e.start)
          const timeStr = d.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })

          return {
            id: `${e.title}-${i}`,
            title: e.title || "Evento",
            time: timeStr,
            date: formatDate(d),
            color: eventColors[i % eventColors.length],
          }
        })

      setEvents(parsed)
      setIsLive(true)
    } catch {
      // endpoint unreachable
    }
    setLoading(false)
  }, [calendarUrl])

  useEffect(() => {
    fetchCalendarEvents()
    const interval = setInterval(fetchCalendarEvents, 300000)
    return () => clearInterval(interval)
  }, [fetchCalendarEvents])

  if (!calendarUrl) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-white/60" />
          <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">
            Agenda
          </h2>
        </div>
        <div className="text-center py-4 space-y-3">
          <p className="text-white/50 text-xs">Vincula tu calendario de Google</p>
          <button
            onClick={() => updateSettings({ showCalendar: false })}
            className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
          >
            Abrir ajustes para configurar
          </button>
        </div>
      </div>
    )
  }

  const count = events.length
  const eventLabel = count === 1 ? t("calendar.events") : t("calendar.events_plural")

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white/60" />
          <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">
            Proximos eventos
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-soft" />
          )}
          <span className="text-xs text-white/40">
            {loading ? "..." : `${count} ${eventLabel}`}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
        </div>
      ) : count === 0 ? (
        <p className="text-white/30 text-xs text-center py-4">
          {t("calendar.noEvents")}
        </p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-3">
              <div className={`w-0.5 h-10 rounded-full ${event.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate text-sm">
                  {event.title}
                </p>
                <p className="text-white/50 text-xs">
                  {event.date} · {event.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
