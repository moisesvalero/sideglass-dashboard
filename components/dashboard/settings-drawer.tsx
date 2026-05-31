"use client"

import { X, MapPin, Thermometer, Eye, EyeOff, Sun, Moon, Monitor } from "lucide-react"
import { useSettings } from "@/lib/settings"
import { useI18n } from "@/lib/i18n"
import type { Settings } from "@/lib/settings"

interface Props {
  open: boolean
  onClose: () => void
}

const citySuggestions = [
  "Madrid", "Barcelona", "New York", "London", "Tokyo", "Paris",
  "Berlin", "Sydney", "Dubai", "Singapore", "Toronto", "Seoul", "Mexico City", "Buenos Aires",
]

const themes = [
  { key: "dark" as const, icon: Moon, label: "Oscuro" },
  { key: "light" as const, icon: Sun, label: "Claro" },
  { key: "system" as const, icon: Monitor, label: "Sistema" },
]

export function SettingsDrawer({ open, onClose }: Props) {
  const { settings, updateSettings } = useSettings()
  const { t } = useI18n()

  if (!open) return null

  const toggle = (key: keyof Settings) => {
    if (typeof settings[key] === "boolean") {
      updateSettings({ [key]: !settings[key] })
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-[101] animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto max-w-md rounded-t-[32px] p-6 pb-8 bg-popover/95 backdrop-blur-[40px] border border-b-0 border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">{t("settings.title")}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">

            {/* Theme */}
            <div>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <Sun className="w-3.5 h-3.5" />
                Tema
              </label>
              <div className="flex gap-2">
                {themes.map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => updateSettings({ theme: key })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all ${
                      settings.theme === key
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Location */}
            <div>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                {t("settings.weatherLocation")}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {citySuggestions.map((city) => (
                  <button
                    key={city}
                    onClick={() => updateSettings({ weatherCity: city })}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                      settings.weatherCity === city
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature Unit */}
            <div>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <Thermometer className="w-3.5 h-3.5" />
                {t("settings.temperature")}
              </label>
              <div className="flex gap-2">
                {(["celsius", "fahrenheit"] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => updateSettings({ tempUnit: unit })}
                    className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                      settings.tempUnit === unit
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {unit === "celsius" ? "°C" : "°F"}
                  </button>
                ))}
              </div>
            </div>

            {/* Widget Toggles */}
            <div>
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <Eye className="w-3.5 h-3.5" />
                {t("settings.visibility")}
              </label>
              <div className="space-y-2">
                {([
                  { key: "showCalendar", label: t("settings.calendar") },
                  { key: "showMotivation", label: t("settings.motivation") },
                  { key: "showHardware", label: t("settings.hardware") },
                  { key: "showNotes", label: t("settings.notes") },
                  { key: "showMusic", label: t("settings.music") },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggle(key)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-muted hover:bg-muted/70 transition-colors"
                  >
                    <span className="text-foreground/80 text-sm">{label}</span>
                    {settings[key] ? (
                      <Eye className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground/50" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
