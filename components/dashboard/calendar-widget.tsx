"use client"

import { useEffect, useState, useCallback } from "react"
import { Calendar, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useSettings } from "@/lib/settings"
import { fetchIcal, isTauri } from "@/lib/tauri"
import { parseIcalEvents } from "@/lib/ical"

interface CalendarEvent {
  id: string
  title: string
  time: string
  date: string
  color: string
}

const eventColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-pink-500",
]

export function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)
  const { t, lang } = useI18n()
  const { settings } = useSettings()

  const icalUrl = settings.calendarIcalUrl?.trim() || ""
  const locale = lang === "es" ? "es-ES" : "en-US"

  const formatDate = useCallback(
    (d: Date) => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      if (d.toDateString() === now.toDateString()) return lang === "es" ? "Hoy" : "Today"
      if (d.toDateString() === tomorrow.toDateString()) return lang === "es" ? "Mañana" : "Tomorrow"
      return d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" })
    },
    [lang, locale]
  )

  const fetchCalendarEvents = useCallback(async () => {
    if (!icalUrl) {
      setLoading(false)
      return
    }

    try {
      let text: string
      if (isTauri()) {
        text = await fetchIcal(icalUrl)
      } else {
        const res = await fetch(icalUrl, { signal: AbortSignal.timeout(12000) })
        if (!res.ok) throw new Error("fetch failed")
        text = await res.text()
      }

      const parsed = parseIcalEvents(text, 5).map((e, i) => ({
        id: e.id,
        title: e.title,
        time: e.start.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: settings.timeFormat === "12",
        }),
        date: formatDate(e.start),
        color: eventColors[i % eventColors.length],
      }))

      setEvents(parsed)
      setIsLive(true)
    } catch {
      setIsLive(false)
    }
    setLoading(false)
  }, [icalUrl, formatDate, locale, settings.timeFormat])

  useEffect(() => {
    void fetchCalendarEvents()
    const interval = setInterval(() => void fetchCalendarEvents(), 300_000)
    return () => clearInterval(interval)
  }, [fetchCalendarEvents])

  if (!icalUrl) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h2 className="widget-title">{t("calendar.schedule")}</h2>
        </div>
        <p className="text-muted-foreground text-sm text-center py-4">{t("calendar.setup")}</p>
        <p className="text-muted-foreground/60 text-xs text-center">{t("calendar.icalHint")}</p>
      </div>
    )
  }

  const count = events.length
  const eventLabel = count === 1 ? t("calendar.events") : t("calendar.events_plural")

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h2 className="widget-title">{t("calendar.schedule")}</h2>
        </div>
        <div className="flex items-center gap-2">
          {isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-soft" />}
          <span className="text-xs text-muted-foreground">
            {loading ? "..." : `${count} ${eventLabel}`}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
        </div>
      ) : count === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-4">{t("calendar.noEvents")}</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-3">
              <div className={`w-0.5 h-10 rounded-full ${event.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium truncate text-sm">{event.title}</p>
                <p className="text-muted-foreground text-xs">
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
