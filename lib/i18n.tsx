"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Lang = "es" | "en"

const translations: Record<Lang, Record<string, string>> = {
  es: {
    "dashboard.title": "Sideglass",
    "dashboard.exitFullscreenHint": "Pantalla completa · F11 o Esc para salir",
    "time.loading": "Cargando...",
    "weather.loading": "Cargando...",
    "weather.noData": "Sin datos",
    "weather.setKey": "No se pudo cargar el clima",
    "calendar.title": "Agenda de hoy",
    "calendar.schedule": "Agenda",
    "calendar.noEvents": "Sin eventos próximos",
    "calendar.events": "evento",
    "calendar.events_plural": "eventos",
    "calendar.setup": "Pega la URL iCal de Google Calendar en ajustes",
    "calendar.icalHint": "Google Calendar > Configuración > Dirección secreta en formato iCal",
    "motivation.title": "Frase del día",
    "hardware.title": "Estado del sistema",
    "hardware.live": "En vivo",
    "hardware.demo": "Demo",
    "hardware.tauriHint": "Ejecuta con Tauri para datos reales",
    "hardware.sensorsLoading": "Conectando sensores de temperatura…",
    "hardware.lhmHint":
      "Uso de CPU/GPU en tiempo real. Si no ves °C, ejecuta Sideglass como administrador o espera unos segundos tras abrir.",
    "notes.title": "Notas",
    "notes.empty": "Sin notas. Pulsa + para añadir.",
    "notes.placeholder": "Escribe algo...",
    "music.title": "YouTube",
    "music.embedHint": "Busca un vídeo de YouTube y reprodúcelo aquí, dentro del panel.",
    "music.search": "Buscar",
    "music.searchPlaceholder": "Buscar en YouTube...",
    "music.searchHint": "Busca y reproduce vídeos sin salir del panel",
    "music.noResults": "Sin resultados. Prueba con otra búsqueda.",
    "music.searchError": "No se pudo buscar en YouTube. Inténtalo de nuevo.",
    "music.invalidLink": "Enlace de YouTube no válido",
    "music.paste": "Pegar enlace de vídeo",
    "music.play": "Reproducir",
    "music.empty": "El vídeo aparecerá aquí",
    "music.close": "Cerrar",
    "settings.title": "Ajustes",
    "settings.weatherLocation": "Ubicación del clima",
    "settings.autoLocation": "Detectar ubicación automáticamente",
    "settings.manualLocation": "Escribe una ciudad (ej. Valencia)",
    "settings.manualLocationHint": "Desactiva la detección automática para escribir tu ciudad.",
    "settings.temperature": "Unidad de temperatura",
    "settings.timeFormat": "Formato de hora",
    "settings.language": "Idioma",
    "settings.visibility": "Visibilidad de widgets",
    "settings.calendar": "Calendario",
    "settings.motivation": "Motivación",
    "settings.hardware": "Monitor de hardware",
    "settings.notes": "Notas",
    "settings.music": "YouTube",
    "settings.autostart": "Iniciar con Windows",
    "settings.hotkey": "Atajo global (mostrar/ocultar)",
    "settings.notifications": "Notificaciones de calendario",
    "settings.reorder": "Arrastra los widgets para reordenar",
    "settings.updates": "Actualizaciones",
    "settings.checkUpdates": "Buscar actualizaciones",
    "settings.checkingUpdates": "Buscando…",
    "settings.upToDate": "Ya tienes la última versión",
    "settings.updateInstalled": "Actualización instalada. Reinicia Sideglass.",
    "settings.updateError": "No se pudo comprobar actualizaciones",
    "update.foundTitle": "Nueva versión disponible",
    "update.foundDesc": "Hay una nueva versión de Sideglass lista para instalar.",
    "update.version": "Versión",
    "update.notesTitle": "Novedades",
    "update.install": "Instalar ahora",
    "update.later": "Ahora no",
    "update.downloadingTitle": "Descargando actualización…",
    "update.downloadingDesc": "No cierres la aplicación durante la instalación.",
    "update.downloadedMb": "{mb} MB descargados",
    "update.installerHint":
      "Si Windows pide confirmación, acepta el instalador. La app puede cerrarse sola al terminar.",
    "update.installedTitle": "Actualización lista",
    "update.installedDesc": "Reinicia Sideglass para aplicar la nueva versión.",
    "update.restart": "Reiniciar ahora",
    "update.errorTitle": "Error al actualizar",
    "update.errorDesc": "No se pudo instalar la actualización. Inténtalo más tarde.",
    "update.close": "Cerrar",
    "hardware.enableSensors": "Activar temperaturas",
    "hardware.enableCpuTemp": "Activar °C",
    "hardware.enablingSensors": "Activando…",
    "hardware.cpuTempHint":
      "La temperatura de la CPU requiere permisos de administrador. Pulsa «Activar °C» junto a CPU y acepta el aviso de Windows.",
    "hardware.sensorsHint":
      "Las temperaturas necesitan permisos de administrador. Pulsa para activarlas (acepta el aviso de Windows).",
    "hardware.sensorsFailed": "No se pudieron activar los sensores. Acepta el aviso de Windows e inténtalo de nuevo.",
    "settings.help": "Ayuda",
    "settings.helpFaq": "Centro de ayuda y preguntas frecuentes",
    "settings.about": "Acerca de",
    "settings.aboutTagline": "Panel para tu monitor secundario",
    "settings.viewSource": "Código fuente en GitHub",
    "settings.version": "Versión",
    "titlebar.help": "Ayuda",
    "titlebar.settings": "Ajustes",
    "titlebar.minimize": "Minimizar",
    "titlebar.maximize": "Maximizar",
    "titlebar.close": "Cerrar",
  },
  en: {
    "dashboard.title": "Sideglass",
    "dashboard.exitFullscreenHint": "Fullscreen · F11 or Esc to exit",
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
    "hardware.sensorsLoading": "Connecting temperature sensors…",
    "hardware.lhmHint":
      "Live CPU/GPU usage. If °C is missing, run Sideglass as administrator or wait a few seconds after launch.",
    "notes.title": "Notes",
    "notes.empty": "No notes yet. Tap + to add.",
    "notes.placeholder": "Write something...",
    "music.title": "YouTube",
    "music.embedHint": "Search a YouTube video and play it here, inside the dashboard.",
    "music.search": "Search",
    "music.searchPlaceholder": "Search on YouTube...",
    "music.searchHint": "Search and play videos without leaving the panel",
    "music.noResults": "No results. Try another search.",
    "music.searchError": "Could not search YouTube. Please try again.",
    "music.invalidLink": "Invalid YouTube link",
    "music.paste": "Paste video link",
    "music.play": "Play",
    "music.empty": "Video will appear here",
    "music.close": "Close",
    "settings.title": "Settings",
    "settings.weatherLocation": "Weather Location",
    "settings.autoLocation": "Detect location automatically",
    "settings.manualLocation": "Type a city (e.g. Valencia)",
    "settings.manualLocationHint": "Turn off automatic detection to type your city.",
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
    "settings.updates": "Updates",
    "settings.checkUpdates": "Check for updates",
    "settings.checkingUpdates": "Checking…",
    "settings.upToDate": "You are on the latest version",
    "settings.updateInstalled": "Update installed. Restart Sideglass.",
    "settings.updateError": "Could not check for updates",
    "update.foundTitle": "New version available",
    "update.foundDesc": "A new version of Sideglass is ready to install.",
    "update.version": "Version",
    "update.notesTitle": "What's new",
    "update.install": "Install now",
    "update.later": "Not now",
    "update.downloadingTitle": "Downloading update…",
    "update.downloadingDesc": "Please don't close the app during installation.",
    "update.downloadedMb": "{mb} MB downloaded",
    "update.installerHint":
      "If Windows asks for confirmation, accept the installer. The app may close when done.",
    "update.installedTitle": "Update ready",
    "update.installedDesc": "Restart Sideglass to apply the new version.",
    "update.restart": "Restart now",
    "update.errorTitle": "Update failed",
    "update.errorDesc": "The update could not be installed. Please try again later.",
    "update.close": "Close",
    "hardware.enableSensors": "Enable temperatures",
    "hardware.enableCpuTemp": "Enable °C",
    "hardware.enablingSensors": "Enabling…",
    "hardware.cpuTempHint":
      "CPU temperature needs administrator rights. Tap «Enable °C» next to CPU and accept the Windows prompt.",
    "hardware.sensorsHint":
      "Temperatures require administrator rights. Click to enable them (accept the Windows prompt).",
    "hardware.sensorsFailed": "Could not enable sensors. Accept the Windows prompt and try again.",
    "settings.help": "Help",
    "settings.helpFaq": "Help center and FAQ",
    "settings.about": "About",
    "settings.aboutTagline": "Panel for your second monitor",
    "settings.viewSource": "Source code on GitHub",
    "settings.version": "Version",
    "titlebar.help": "Help",
    "titlebar.settings": "Settings",
    "titlebar.minimize": "Minimize",
    "titlebar.maximize": "Maximize",
    "titlebar.close": "Close",
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
