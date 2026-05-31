"use client"

import { useState } from "react"
import { TimeWeatherWidget } from "@/components/dashboard/time-weather-widget"
import { CalendarWidget } from "@/components/dashboard/calendar-widget"
import { MotivationWidget } from "@/components/dashboard/motivation-widget"
import { HardwareMonitor } from "@/components/dashboard/hardware-monitor"
import { AIDock } from "@/components/dashboard/ai-dock"
import { Titlebar } from "@/components/dashboard/titlebar"
import { SettingsDrawer } from "@/components/dashboard/settings-drawer"
import { NotesWidget } from "@/components/dashboard/notes-widget"
import { MusicWidget } from "@/components/dashboard/music-widget"
import { useSettings } from "@/lib/settings"
import { useI18n } from "@/lib/i18n"

export default function Dashboard() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { settings } = useSettings()
  const { t } = useI18n()
  const isDark = settings.theme === "dark"

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <div className="fixed inset-0 -z-10 bg-background" />
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: isDark
            ? `
              radial-gradient(ellipse at 20% 20%, rgba(30, 30, 80, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(50, 20, 80, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(20, 30, 60, 0.3) 0%, transparent 70%)
            `
            : `
              radial-gradient(ellipse at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(168, 85, 247, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 70%)
            `,
        }}
      />

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-blue-900/10" : "bg-blue-500/8"}`} />
        <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl ${isDark ? "bg-purple-900/10" : "bg-purple-500/6"}`} />
      </div>

      <Titlebar onSettingsClick={() => setSettingsOpen(true)} title={t("dashboard.title")} />

      <div className="flex flex-col min-h-screen p-4 gap-4 max-w-md mx-auto pb-28 pt-10">
        <TimeWeatherWidget />
        {settings.showCalendar && <CalendarWidget />}
        {settings.showMotivation && <MotivationWidget />}
        {settings.showHardware && <HardwareMonitor />}
        {settings.showNotes && <NotesWidget />}
        {settings.showMusic && <MusicWidget />}
      </div>

      <AIDock />

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </main>
  )
}
