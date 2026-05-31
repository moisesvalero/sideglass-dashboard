"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface Settings {
  weatherCity: string
  tempUnit: "celsius" | "fahrenheit"
  theme: "dark" | "light" | "system"
  showCalendar: boolean
  showMotivation: boolean
  showHardware: boolean
  showNotes: boolean
  showMusic: boolean
}

const defaultSettings: Settings = {
  weatherCity: "Madrid",
  tempUnit: "celsius",
  theme: "dark",
  showCalendar: true,
  showMotivation: true,
  showHardware: true,
  showNotes: false,
  showMusic: false,
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

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("dashboard-settings")
    if (stored) {
      try {
        const parsed = { ...defaultSettings, ...JSON.parse(stored) }
        setSettings(parsed)
      } catch { /* ignore */ }
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

  if (!mounted) return <>{children}</>

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
