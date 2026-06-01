"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export const WIDGET_IDS = ["time", "hardware", "calendar", "motivation", "notes", "music"] as const

export type WidgetId = (typeof WIDGET_IDS)[number]
export type WidgetLayout = { cols: number; rows: number }

export const DEFAULT_WIDGET_LAYOUTS: Record<WidgetId, WidgetLayout> = {
  time: { cols: 4, rows: 9 },
  hardware: { cols: 4, rows: 16 },
  calendar: { cols: 2, rows: 9 },
  motivation: { cols: 2, rows: 7 },
  notes: { cols: 2, rows: 10 },
  music: { cols: 4, rows: 16 },
}

export interface Settings {
  weatherCity: string
  useAutoLocation: boolean
  tempUnit: "celsius" | "fahrenheit"
  timeFormat: "12" | "24"
  theme: "dark" | "light" | "system"
  calendarIcalUrl: string
  widgetOrder: WidgetId[]
  widgetLayouts: Record<WidgetId, WidgetLayout>
  showCalendar: boolean
  showMotivation: boolean
  showHardware: boolean
  showNotes: boolean
  showMusic: boolean
  autostart: boolean
  globalHotkey: string
  calendarNotifications: boolean
}

const defaultSettings: Settings = {
  weatherCity: "Madrid",
  useAutoLocation: true,
  tempUnit: "celsius",
  timeFormat: "24",
  theme: "dark",
  calendarIcalUrl: "",
  widgetOrder: [...WIDGET_IDS],
  widgetLayouts: { ...DEFAULT_WIDGET_LAYOUTS },
  showCalendar: true,
  showMotivation: true,
  showHardware: true,
  showNotes: true,
  showMusic: true,
  autostart: false,
  globalHotkey: "CommandOrControl+Shift+D",
  calendarNotifications: true,
}

type SettingsContextType = {
  settings: Settings
  updateSettings: (partial: Partial<Settings>) => void
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
})

function applyTheme(theme: Settings["theme"]) {
  const root = document.documentElement
  root.classList.remove("light", "dark")

  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    root.classList.add(prefersDark ? "dark" : "light")
  } else {
    root.classList.add(theme)
  }
}

function migrateStored(raw: Record<string, unknown>): Settings {
  const next = { ...defaultSettings, ...raw } as Settings & {
    calendarScriptUrl?: string
  }
  if (!next.calendarIcalUrl && next.calendarScriptUrl) {
    next.calendarIcalUrl = next.calendarScriptUrl
  }
  if (!Array.isArray(next.widgetOrder) || next.widgetOrder.length === 0) {
    next.widgetOrder = [...WIDGET_IDS]
  }
  const rawLayouts =
    typeof raw.widgetLayouts === "object" && raw.widgetLayouts
      ? raw.widgetLayouts
      : typeof raw.widgetSizes === "object" && raw.widgetSizes
        ? raw.widgetSizes
        : {}
  next.widgetLayouts = { ...DEFAULT_WIDGET_LAYOUTS }
  for (const id of WIDGET_IDS) {
    const value = (rawLayouts as Record<string, unknown>)[id]
    if (
      typeof value === "object" &&
      value &&
      typeof (value as WidgetLayout).cols === "number" &&
      typeof (value as WidgetLayout).rows === "number"
    ) {
      next.widgetLayouts[id] = {
        cols: Math.min(4, Math.max(1, Math.round((value as WidgetLayout).cols))),
        rows: Math.min(28, Math.max(5, Math.round((value as WidgetLayout).rows))),
      }
    }
  }
  return next
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("dashboard-settings")
    if (stored) {
      try {
        setSettings(migrateStored(JSON.parse(stored)))
      } catch {
        /* ignore */
      }
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    applyTheme(settings.theme)

    if (settings.theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      const listener = () => applyTheme("system")
      mq.addEventListener("change", listener)
      return () => mq.removeEventListener("change", listener)
    }
  }, [settings.theme, mounted])

  const updateSettings = (partial: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial }
      localStorage.setItem("dashboard-settings", JSON.stringify(next))
      return next
    })
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
