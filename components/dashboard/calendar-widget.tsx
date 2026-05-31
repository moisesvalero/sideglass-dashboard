"use client"

import { useEffect, useState, useCallback } from "react"
import { Calendar } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface CalendarEvent {
  id: string
  title: string
  time: string
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

const fallbackEvents: CalendarEvent[] = [
  { id: "1", title: "Team Standup", time: "09:00", color: eventColors[0] },
  { id: "2", title: "Code Review Session", time: "11:30", color: eventColors[1] },
  { id: "3", title: "Design System Sync", time: "14:00", color: eventColors[2] },
  { id: "4", title: "Sprint Planning", time: "16:30", color: eventColors[3] },
]

const CALENDAR_ENDPOINT = "https://script.google.com/macros/s/AKfycbyJaCXIbV5WpzI9wFC57mKZfxFDaeKB2jNF8JpNrnbB7AquaPXRwsInUfzu_exC_PhA5Q/exec"

export function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>(fallbackEvents)
  const [isLive, setIsLive] = useState(false)
  const { t } = useI18n()

  const fetchCalendarEvents = useCallback(async () => {
    try {
      const res = await fetch(CALENDAR_ENDPOINT, {
        signal: AbortSignal.timeout(5000),
      })

      if (!res.ok) return

      const data = await res.json()
      if (!Array.isArray(data) || !data.length) {
        setEvents([])
        setIsLive(true)
        return
      }

      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      const todayEnd = todayStart + 24 * 60 * 60 * 1000

      const parsed: CalendarEvent[] = data
        .filter((e: { start: string; end: string }) => {
          const eventStart = new Date(e.start).getTime()
          const eventEnd = new Date(e.end).getTime()
          return eventStart < todayEnd && eventEnd > todayStart
        })
        .slice(0, 7)
        .map((e: { title: string; start: string }, i: number) => {
          const d = new Date(e.start)
          const timeStr = d.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })

          return {
            id: `${e.title}-${i}`,
            title: e.title || "Event",
            time: timeStr,
            color: eventColors[i % eventColors.length],
          }
        })

      setEvents(parsed)
      setIsLive(true)
    } catch { /* keep fallback */ }
  }, [])

  useEffect(() => {
    fetchCalendarEvents()
    const interval = setInterval(fetchCalendarEvents, 300000)
    return () => clearInterval(interval)
  }, [fetchCalendarEvents])

  const count = events.length
  const eventLabel = count === 1 ? t("calendar.events") : t("calendar.events_plural")

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white/60" />
          <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">
            {isLive ? t("calendar.title") : t("calendar.schedule")}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-soft" />
          )}
          <span className="text-xs text-white/40">
            {count} {eventLabel}
          </span>
        </div>
      </div>

      {count === 0 ? (
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
                <p className="text-white/50 text-xs">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
