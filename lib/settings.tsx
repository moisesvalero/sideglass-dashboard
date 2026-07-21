"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export const WIDGET_IDS = ["time", "hardware", "calendar", "motivation", "notes", "music"] as const

export type WidgetId = (typeof WIDGET_IDS)[number]
export type WidgetLayout = { cols: number; rows: number }
export type WidgetConstraints = {
  minCols: number
  minRows: number
  maxCols?: number
  maxRows?: number
}

export const WIDGET_CONSTRAINTS: Record<WidgetId, WidgetConstraints> = {
  time: { minCols: 1, minRows: 6, maxCols: 4, maxRows: 16 },
  hardware: { minCols: 2, minRows: 7, maxCols: 4, maxRows: 16 },
  calendar: { minCols: 1, minRows: 6, maxCols: 4, maxRows: 18 },
  motivation: { minCols: 1, minRows: 5, maxCols: 4, maxRows: 12 },
  notes: { minCols: 1, minRows: 5, maxCols: 4, maxRows: 16 },
  music: { minCols: 1, minRows: 6, maxCols: 4, maxRows: 16 },
}

export const DEFAULT_WIDGET_ORDER: WidgetId[] = [
  "time",
  "motivation",
  "notes",
  "calendar",
  "hardware",
  "music",
]

const LEGACY_DEFAULT_WIDGET_LAYOUTS: Record<WidgetId, WidgetLayout> = {
  time: { cols: 4, rows: 12 },
  hardware: { cols: 4, rows: 9 },
  calendar: { cols: 4, rows: 10 },
  motivation: { cols: 2, rows: 6 },
  notes: { cols: 2, rows: 6 },
  music: { cols: 4, rows: 9 },
}

export const DEFAULT_WIDGET_LAYOUTS: Record<WidgetId, WidgetLayout> = {
  time: { cols: 4, rows: 10 },
  hardware: { cols: 4, rows: 8 },
  calendar: { cols: 4, rows: 10 },
  motivation: { cols: 2, rows: 6 },
  notes: { cols: 2, rows: 6 },
  music: { cols: 4, rows: 9 },
}

export const LANDSCAPE_WIDGET_LAYOUTS: Record<WidgetId, WidgetLayout> = {
  time: { cols: 3, rows: 13 },
  motivation: { cols: 1, rows: 6 },
  notes: { cols: 1, rows: 7 },
  calendar: { cols: 2, rows: 13 },
  hardware: { cols: 2, rows: 9 },
  music: { cols: 2, rows: 9 },
}

function cloneLayouts(layouts: Record<WidgetId, WidgetLayout>) {
  return Object.fromEntries(WIDGET_IDS.map((id) => [id, { ...layouts[id] }])) as Record<
    WidgetId,
    WidgetLayout
  >
}

function shouldUseLandscapeDefaults() {
  if (typeof window === "undefined") return false
  return window.innerWidth >= 1280 && window.innerWidth / Math.max(1, window.innerHeight) >= 1.35
}

export function getDefaultWidgetLayouts() {
  return cloneLayouts(
    shouldUseLandscapeDefaults() ? LANDSCAPE_WIDGET_LAYOUTS : DEFAULT_WIDGET_LAYOUTS
  )
}

function layoutMatches(a: Record<string, unknown>, b: Record<WidgetId, WidgetLayout>) {
  return WIDGET_IDS.every((id) => {
    const value = a[id] as Partial<WidgetLayout> | undefined
    return value?.cols === b[id].cols && value?.rows === b[id].rows
  })
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
  showAi: boolean
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
  widgetOrder: [...DEFAULT_WIDGET_ORDER],
  widgetLayouts: { ...DEFAULT_WIDGET_LAYOUTS },
  showCalendar: true,
  showMotivation: true,
  showHardware: true,
  showNotes: true,
  showMusic: true,
  showAi: true,
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
    next.widgetOrder = [...DEFAULT_WIDGET_ORDER]
  } else {
    // Ensure only valid WIDGET_IDS are present in widgetOrder when upgrading from earlier versions
    const currentOrder = next.widgetOrder.filter((id) => WIDGET_IDS.includes(id as WidgetId))
    for (const id of WIDGET_IDS) {
      if (!currentOrder.includes(id)) {
        currentOrder.push(id)
      }
    }
    next.widgetOrder = currentOrder
  }
  if (next.showAi === undefined) {
    next.showAi = true
  }
  const defaultLayouts = getDefaultWidgetLayouts()
  const rawLayouts =
    typeof raw.widgetLayouts === "object" && raw.widgetLayouts
      ? raw.widgetLayouts
      : typeof raw.widgetSizes === "object" && raw.widgetSizes
        ? raw.widgetSizes
        : {}
  next.widgetLayouts = defaultLayouts
  if (layoutMatches(rawLayouts as Record<string, unknown>, LEGACY_DEFAULT_WIDGET_LAYOUTS)) {
    return next
  }
  for (const id of WIDGET_IDS) {
    const value = (rawLayouts as Record<string, unknown>)[id]
    const constraints = WIDGET_CONSTRAINTS[id]
    if (
      typeof value === "object" &&
      value &&
      typeof (value as WidgetLayout).cols === "number" &&
      typeof (value as WidgetLayout).rows === "number"
    ) {
      next.widgetLayouts[id] = {
        cols: Math.min(
          constraints.maxCols ?? 4,
          Math.max(constraints.minCols, Math.round((value as WidgetLayout).cols))
        ),
        rows: Math.min(
          constraints.maxRows ?? 24,
          Math.max(constraints.minRows, Math.round((value as WidgetLayout).rows))
        ),
      }
    } else {
      next.widgetLayouts[id] = defaultLayouts[id]
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
    } else {
      setSettings((prev) => ({
        ...prev,
        widgetOrder: [...DEFAULT_WIDGET_ORDER],
        widgetLayouts: getDefaultWidgetLayouts(),
      }))
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
