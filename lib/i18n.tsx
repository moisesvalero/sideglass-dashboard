"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Lang = "es" | "en"

const translations: Record<Lang, Record<string, string>> = {
  es: {
    "dashboard.title": "Desk Dashboard",
    "time.loading": "Cargando...",
    "weather.loading": "Cargando...",
    "weather.noData": "Sin datos",
    "weather.setKey": "No se pudo cargar el clima",
    "calendar.title": "Agenda de hoy",
    "calendar.schedule": "Agenda",
    "calendar.noEvents": "Sin eventos proximos",
    "calendar.events": "evento",
    "calendar.events_plural": "eventos",
    "calendar.setup": "Pega la URL iCal de Google Calendar en ajustes",
    "calendar.icalHint": "Google Calendar > Configuracion > Direccion secreta en formato iCal",
    "motivation.title": "Frase del dia",
    "hardware.title": "Estado del sistema",
    "hardware.live": "En vivo",
    "hardware.demo": "Demo",
    "hardware.tauriHint": "Ejecuta con Tauri para datos reales",
    "hardware.noTemp": "Sin sensor",
    "hardware.lhmHint": "No se pudieron leer sensores. Reinicia la app.",
    "notes.title": "Notas",
    "notes.empty": "Sin notas. Pulsa + para anadir.",
    "notes.placeholder": "Escribe algo...",
    "music.title": "YouTube",
    "music.open": "Abrir YouTube",
    "music.openHint": "Inicia sesion con tu cuenta. Maximiza y pantalla completa disponibles.",
    "music.paste": "Pegar enlace de video",
    "settings.title": "Ajustes",
    "settings.weatherLocation": "Ubicacion del clima",
    "settings.autoLocation": "Detectar ubicacion automaticamente",
    "settings.temperature": "Unidad de temperatura",
    "settings.timeFormat": "Formato de hora",
    "settings.language": "Idioma",
    "settings.visibility": "Visibilidad de widgets",
    "settings.calendar": "Calendario",
    "settings.motivation": "Motivacion",
    "settings.hardware": "Monitor Hardware",
    "settings.notes": "Notas",
    "settings.music": "YouTube",
    "settings.autostart": "Iniciar con Windows",
    "settings.hotkey": "Atajo global (mostrar/ocultar)",
    "settings.notifications": "Notificaciones de calendario",
    "settings.reorder": "Arrastra los widgets para reordenar",
  },
  en: {
    "dashboard.title": "Desk Dashboard",
    "time.loading": "Loading...",
    "weather.loading": "Loading...",
    "weather.noData": "No data",
    "weather.setKey": "Could not load weather",
    "calendar.title": "Today's Schedule",
    "calendar.schedule": "Schedule",
    "calendar.noEvents": "No upcoming events",
    "calendar.events": "event",
    "calendar.events_plural": "events",
    "calendar.setup": "Paste your Google Calendar iCal URL in settings",
    "calendar.icalHint": "Google Calendar > Settings > Secret address in iCal format",
    "motivation.title": "Daily Quote",
    "hardware.title": "System Status",
    "hardware.live": "Live",
    "hardware.demo": "Demo",
    "hardware.tauriHint": "Run with Tauri for real data",
    "hardware.noTemp": "No sensor",
    "hardware.lhmHint": "Could not read sensors. Try restarting the app.",
    "notes.title": "Notes",
    "notes.empty": "No notes yet. Tap + to add.",
    "notes.placeholder": "Write something...",
    "music.title": "YouTube",
    "music.open": "Open YouTube",
    "music.openHint": "Sign in with your account. Maximize and fullscreen supported.",
    "music.paste": "Paste video link",
    "settings.title": "Settings",
    "settings.weatherLocation": "Weather Location",
    "settings.autoLocation": "Detect location automatically",
    "settings.temperature": "Temperature Unit",
    "settings.timeFormat": "Time format",
    "settings.language": "Language",
    "settings.visibility": "Widget Visibility",
    "settings.calendar": "Calendar",
    "settings.motivation": "Motivation",
    "settings.hardware": "Hardware Monitor",
    "settings.notes": "Notes",
    "settings.music": "YouTube",
    "settings.autostart": "Start with Windows",
    "settings.hotkey": "Global shortcut (show/hide)",
    "settings.notifications": "Calendar notifications",
    "settings.reorder": "Drag widgets to reorder",
  },
}

type I18nContextType = {
  t: (key: string) => string
  lang: Lang
  setLang: (lang: Lang) => void
}

const I18nContext = createContext<I18nContextType>({
  t: (key) => key,
  lang: "es",
  setLang: () => {},
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es")
  useEffect(() => {
    const stored = localStorage.getItem("dashboard-lang") as Lang | null
    if (stored === "es" || stored === "en") {
      setLangState(stored)
    } else {
      const browserLang = navigator.language.toLowerCase()
      setLangState(browserLang.startsWith("es") ? "es" : "en")
    }
  }, [])

  const setLang = (next: Lang) => {
    setLangState(next)
    localStorage.setItem("dashboard-lang", next)
  }

  const t = (key: string) => translations[lang][key] || key

  return <I18nContext.Provider value={{ t, lang, setLang }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
