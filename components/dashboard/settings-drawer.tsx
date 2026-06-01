"use client"

import {
  X,
  MapPin,
  Thermometer,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  Calendar,
  Clock,
  Languages,
  Power,
  Keyboard,
  Bell,
} from "lucide-react"
import { useSettings, type Settings } from "@/lib/settings"
import { useI18n } from "@/lib/i18n"

interface Props {
  open: boolean
  onClose: () => void
}

const citySuggestions = [
  "Madrid",
  "Barcelona",
  "New York",
  "London",
  "Tokyo",
  "Paris",
  "Berlin",
  "Mexico City",
]

const themes = [
  { key: "dark" as const, icon: Moon, label: "Oscuro" },
  { key: "light" as const, icon: Sun, label: "Claro" },
  { key: "system" as const, icon: Monitor, label: "Sistema" },
]

export function SettingsDrawer({ open, onClose }: Props) {
  const { settings, updateSettings } = useSettings()
  const { t, lang, setLang } = useI18n()

  if (!open) return null

  const toggle = (key: keyof Settings) => {
    if (typeof settings[key] === "boolean") {
      updateSettings({ [key]: !settings[key] })
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-[101] animate-in">
        <div className="mx-auto max-w-lg rounded-t-2xl p-6 pb-10 bg-popover border border-b-0 border-border shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">{t("settings.title")}</h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-5 max-h-[65vh] overflow-y-auto custom-scrollbar pr-1">
            <section>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <Sun className="w-3.5 h-3.5" />
                Tema
              </label>
              <div className="flex flex-wrap gap-2">
                {themes.map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateSettings({ theme: key })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all ${
                      settings.theme === key
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <Languages className="w-3.5 h-3.5" />
                {t("settings.language")}
              </label>
              <div className="flex gap-2">
                {(["es", "en"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    className={`px-4 py-2 rounded-full text-xs ${
                      lang === l
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {l === "es" ? "Espanol" : "English"}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <Clock className="w-3.5 h-3.5" />
                {t("settings.timeFormat")}
              </label>
              <div className="flex gap-2">
                {(["24", "12"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => updateSettings({ timeFormat: f })}
                    className={`px-4 py-2 rounded-full text-xs ${
                      settings.timeFormat === f
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {f === "24" ? "24h" : "12h"}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                {t("settings.weatherLocation")}
              </label>
              <label className="flex items-center gap-2 mb-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={settings.useAutoLocation}
                  onChange={(e) => updateSettings({ useAutoLocation: e.target.checked })}
                  className="rounded"
                />
                {t("settings.autoLocation")}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {citySuggestions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => updateSettings({ weatherCity: city })}
                    className={`px-3 py-1.5 rounded-full text-xs ${
                      settings.weatherCity === city
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <Thermometer className="w-3.5 h-3.5" />
                {t("settings.temperature")}
              </label>
              <div className="flex gap-2">
                {(["celsius", "fahrenheit"] as const).map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => updateSettings({ tempUnit: unit })}
                    className={`px-4 py-1.5 rounded-full text-xs ${
                      settings.tempUnit === unit
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {unit === "celsius" ? "°C" : "°F"}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                Google Calendar (iCal)
              </label>
              <p className="text-muted-foreground text-xs mb-2 leading-relaxed">
                {t("calendar.icalHint")}
              </p>
              <input
                type="url"
                value={settings.calendarIcalUrl || ""}
                onChange={(e) => updateSettings({ calendarIcalUrl: e.target.value })}
                placeholder="https://calendar.google.com/calendar/ical/..."
                className="w-full bg-muted rounded-xl px-3 py-2 text-sm text-foreground outline-none border border-border placeholder:text-muted-foreground/50"
              />
            </section>

            <section>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <Power className="w-3.5 h-3.5" />
                {t("settings.autostart")}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.autostart}
                  onChange={(e) => updateSettings({ autostart: e.target.checked })}
                />
                {t("settings.autostart")}
              </label>
            </section>

            <section>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <Keyboard className="w-3.5 h-3.5" />
                {t("settings.hotkey")}
              </label>
              <input
                type="text"
                value={settings.globalHotkey}
                onChange={(e) => updateSettings({ globalHotkey: e.target.value })}
                className="w-full bg-muted rounded-xl px-3 py-2 text-sm font-mono border border-border"
              />
            </section>

            <section>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <Bell className="w-3.5 h-3.5" />
                {t("settings.notifications")}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.calendarNotifications}
                  onChange={(e) => updateSettings({ calendarNotifications: e.target.checked })}
                />
                {t("settings.notifications")}
              </label>
            </section>

            <section>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <Eye className="w-3.5 h-3.5" />
                {t("settings.visibility")}
              </label>
              <div className="space-y-2">
                {(
                  [
                    { key: "showCalendar", label: t("settings.calendar") },
                    { key: "showMotivation", label: t("settings.motivation") },
                    { key: "showHardware", label: t("settings.hardware") },
                    { key: "showNotes", label: t("settings.notes") },
                    { key: "showMusic", label: t("settings.music") },
                  ] as const
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggle(key)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-muted hover:bg-muted/80"
                  >
                    <span className="text-foreground/90 text-sm">{label}</span>
                    {settings[key] ? (
                      <Eye className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground/50" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            <p className="text-xs text-muted-foreground">{t("settings.reorder")}</p>
          </div>
        </div>
      </div>
    </>
  )
}
