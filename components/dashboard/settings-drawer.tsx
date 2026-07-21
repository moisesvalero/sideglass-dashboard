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
  Download,
  HelpCircle,
  Info,
  Github,
  ExternalLink,
} from "lucide-react"
import { useSettings, type Settings } from "@/lib/settings"
import { useI18n } from "@/lib/i18n"
import { APP_NAME, APP_VERSION, GITHUB_REPO, SITE_URL } from "@/lib/site"
import { isTauri, openExternalUrl } from "@/lib/tauri"
import { useUpdater } from "@/lib/updater"
import { CityAutocomplete } from "@/components/dashboard/city-autocomplete"

interface Props {
  open: boolean
  onClose: () => void
}

const themes = [
  { key: "dark" as const, icon: Moon, label: "Oscuro" },
  { key: "light" as const, icon: Sun, label: "Claro" },
  { key: "system" as const, icon: Monitor, label: "Sistema" },
]

export function SettingsDrawer({ open, onClose }: Props) {
  const { settings, updateSettings } = useSettings()
  const { t, lang, setLang } = useI18n()
  const { status: updateState, check } = useUpdater()
  const inTauri = isTauri()

  if (!open) return null

  const updateBusy = updateState === "checking"
  const updateStatus =
    updateState === "checking"
      ? t("settings.checkingUpdates")
      : updateState === "up-to-date"
        ? t("settings.upToDate")
        : updateState === "error"
          ? t("settings.updateError")
          : null

  const handleCheckUpdates = async () => {
    if (!inTauri) return
    await check(true)
  }

  const toggle = (key: keyof Settings) => {
    if (typeof settings[key] === "boolean") {
      updateSettings({ [key]: !settings[key] })
    }
  }

  const faqUrl = `${SITE_URL}${lang === "es" ? "/#faq" : "/en#faq"}`

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-[101] animate-in">
        <div className="dashboard-surface mx-auto w-full max-w-2xl rounded-t-[20px] border-b-0 p-6 pb-10 sm:px-8 md:max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">{t("settings.title")}</h2>
            <button
              type="button"
              onClick={onClose}
              className="dashboard-control flex h-8 w-8 items-center justify-center hover:bg-muted/70"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="grid max-h-[70vh] gap-x-8 gap-y-5 overflow-y-auto custom-scrollbar pr-1 md:grid-cols-2">
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
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs transition-all ${
                      settings.theme === key
                        ? "bg-primary text-primary-foreground"
                        : "dashboard-control text-muted-foreground hover:bg-muted/70"
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
                    className={`rounded-full px-4 py-2 text-xs ${
                      lang === l
                        ? "bg-primary text-primary-foreground"
                        : "dashboard-control text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {l === "es" ? "Español" : "English"}
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
                    className={`rounded-full px-4 py-2 text-xs ${
                      settings.timeFormat === f
                        ? "bg-primary text-primary-foreground"
                        : "dashboard-control text-muted-foreground hover:bg-muted/70"
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
              <CityAutocomplete
                value={settings.weatherCity}
                onChange={(city) => updateSettings({ weatherCity: city })}
                disabled={settings.useAutoLocation}
                placeholder={t("settings.manualLocation")}
                lang={lang}
              />
              {settings.useAutoLocation && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {t("settings.manualLocationHint")}
                </p>
              )}
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
                    className={`rounded-full px-4 py-1.5 text-xs ${
                      settings.tempUnit === unit
                        ? "bg-primary text-primary-foreground"
                        : "dashboard-control text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {unit === "celsius" ? "°C" : "°F"}
                  </button>
                ))}
              </div>
            </section>

            <section className="md:col-span-2">
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
                className="dashboard-control w-full px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
              />
            </section>

            {inTauri && (
              <section>
                <label className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Download className="h-3.5 w-3.5" />
                  {t("settings.updates")}
                </label>
                <p className="mb-2 text-xs text-muted-foreground">v{APP_VERSION}</p>
                <button
                  type="button"
                  disabled={updateBusy}
                  onClick={() => void handleCheckUpdates()}
                  className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {updateBusy ? t("settings.checkingUpdates") : t("settings.checkUpdates")}
                </button>
                {updateStatus && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">{updateStatus}</p>
                )}
              </section>
            )}

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
                className="dashboard-control w-full px-3 py-2 font-mono text-sm"
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

            <section className="md:col-span-2">
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
                    { key: "showAi", label: t("settings.ai") },
                  ] as const
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggle(key)}
                    className="dashboard-control flex w-full items-center justify-between px-3 py-2 hover:bg-muted/70"
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

            <p className="text-xs text-muted-foreground md:col-span-2">{t("settings.reorder")}</p>

            <section className="md:col-span-2">
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <HelpCircle className="w-3.5 h-3.5" />
                {t("settings.help")}
              </label>
              <button
                type="button"
                onClick={() => void openExternalUrl(faqUrl)}
                className="dashboard-control flex w-full items-center justify-between px-3 py-2.5 transition-colors hover:bg-muted/70"
              >
                <span className="text-foreground/90 text-sm">{t("settings.helpFaq")}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </section>

            <section className="md:col-span-2">
              <label className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
                <Info className="w-3.5 h-3.5" />
                {t("settings.about")}
              </label>
              <div className="dashboard-control space-y-2 px-3 py-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{APP_NAME}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {t("settings.version")} {APP_VERSION}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{t("settings.aboutTagline")}</p>
                <button
                  type="button"
                  onClick={() => void openExternalUrl(GITHUB_REPO)}
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <Github className="w-3.5 h-3.5" />
                  {t("settings.viewSource")}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
