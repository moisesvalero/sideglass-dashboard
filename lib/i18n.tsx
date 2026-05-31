"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Lang = "es" | "en"

const translations: Record<Lang, Record<string, string>> = {
  es: {
    "dashboard.title": "Panel",
    "time.loading": "Cargando...",
    "weather.loading": "Cargando...",
    "weather.noData": "Sin datos",
    "weather.setKey": "Configurar API key",
    "calendar.title": "Agenda de hoy",
    "calendar.schedule": "Agenda",
    "calendar.noEvents": "Sin eventos hoy",
    "calendar.events": "evento",
    "calendar.events_plural": "eventos",
    "calendar.allDay": "Todo el dia",
    "motivation.title": "Frase del dia",
    "hardware.title": "Estado del sistema",
    "hardware.live": "En vivo",
    "hardware.demo": "Demo",
    "hardware.tauriHint": "Ejecuta con Tauri para datos reales",
    "notes.title": "Notas",
    "notes.empty": "Sin notas. Pulsa + para anadir.",
    "notes.placeholder": "Escribe algo...",
    "music.title": "YouTube",
    "music.search": "Buscar en YouTube o pegar enlace...",
    "music.paste": "O pega un enlace de YouTube aqui...",
    "music.go": "Ir",
    "settings.title": "Ajustes",
    "settings.weatherLocation": "Ubicacion del clima",
    "settings.temperature": "Unidad de temperatura",
    "settings.visibility": "Visibilidad de widgets",
    "settings.calendar": "Calendario",
    "settings.motivation": "Motivacion",
    "settings.hardware": "Monitor Hardware",
    "settings.notes": "Notas",
    "settings.music": "Reproductor",
  },
  en: {
    "dashboard.title": "Dashboard",
    "time.loading": "Loading...",
    "weather.loading": "Loading...",
    "weather.noData": "No data",
    "weather.setKey": "Set API key",
    "calendar.title": "Today's Schedule",
    "calendar.schedule": "Schedule",
    "calendar.noEvents": "No events today",
    "calendar.events": "event",
    "calendar.events_plural": "events",
    "calendar.allDay": "All day",
    "motivation.title": "Daily Quote",
    "hardware.title": "System Status",
    "hardware.live": "Live",
    "hardware.demo": "Demo",
    "hardware.tauriHint": "Run with Tauri for real data",
    "notes.title": "Notes",
    "notes.empty": "No notes yet. Tap + to add.",
    "notes.placeholder": "Write something...",
    "music.title": "YouTube",
    "music.search": "Search YouTube or paste link...",
    "music.paste": "Or paste YouTube link here...",
    "music.go": "Go",
    "settings.title": "Settings",
    "settings.weatherLocation": "Weather Location",
    "settings.temperature": "Temperature Unit",
    "settings.visibility": "Widget Visibility",
    "settings.calendar": "Calendar",
    "settings.motivation": "Motivation",
    "settings.hardware": "Hardware Monitor",
    "settings.notes": "Notes",
    "settings.music": "Music Player",
  },
}

type I18nContextType = {
  t: (key: string) => string
  lang: Lang
}

const I18nContext = createContext<I18nContextType>({
  t: (key) => key,
  lang: "en",
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("dashboard-lang") as Lang | null
    if (stored === "es" || stored === "en") {
      setLang(stored)
    } else {
      const browserLang = navigator.language.toLowerCase()
      setLang(browserLang.startsWith("es") ? "es" : "en")
    }
    setMounted(true)
  }, [])

  const t = (key: string) => translations[lang][key] || key

  if (!mounted) return <>{children}</>

  return (
    <I18nContext.Provider value={{ t, lang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
