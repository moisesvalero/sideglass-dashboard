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
      <div className="glass-tile p-5">
        <div className="dashboard-widget-header mb-3">
          <div className="dashboard-widget-title">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{t("calendar.schedule")}</span>
          </div>
        </div>
        <p className="py-3 text-center text-sm text-muted-foreground">{t("calendar.setup")}</p>
        <p className="text-center text-xs text-muted-foreground/60">{t("calendar.icalHint")}</p>
      </div>
    )
  }

  const count = events.length
  const eventLabel = count === 1 ? t("calendar.events") : t("calendar.events_plural")
  const [next, ...rest] = events

  return (
    <div className="glass-tile p-5">
      <div className="dashboard-widget-header mb-4">
        <div className="dashboard-widget-title">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{t("calendar.schedule")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isLive && <span className="pulse-soft h-1.5 w-1.5 rounded-full bg-emerald-500" />}
          <span className="text-xs text-muted-foreground">
            {loading ? "..." : `${count} ${eventLabel}`}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : count === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">{t("calendar.noEvents")}</p>
      ) : (
        <div className="space-y-0">
          {next ? (
            <div className="dashboard-selection mb-3 px-3 py-3">
              <p className="metric-label">{t("calendar.nextUp")}</p>
              <p className="mt-1 truncate text-base font-medium text-foreground">{next.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {next.date} · {next.time}
              </p>
            </div>
          ) : null}
          {rest.map((event) => (
            <div
              key={event.id}
              className="hairline flex items-center gap-3 border-t border-border/40 py-2.5"
            >
              <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${event.color}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground">
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
