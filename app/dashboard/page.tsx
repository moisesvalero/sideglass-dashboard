"use client"

import { useState, useMemo } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { TimeWeatherWidget } from "@/components/dashboard/time-weather-widget"
import { CalendarWidget } from "@/components/dashboard/calendar-widget"
import { MotivationWidget } from "@/components/dashboard/motivation-widget"
import { HardwareMonitor } from "@/components/dashboard/hardware-monitor"
import { AIDock } from "@/components/dashboard/ai-dock"
import { Titlebar } from "@/components/dashboard/titlebar"
import { SettingsDrawer } from "@/components/dashboard/settings-drawer"
import { UpdateDialog } from "@/components/dashboard/update-dialog"
import { UpdaterProvider, UpdaterSettingsBridge } from "@/lib/updater"
import { NotesWidget } from "@/components/dashboard/notes-widget"
import { MusicWidget } from "@/components/dashboard/music-widget"
import { SortableWidget } from "@/components/dashboard/widget-sortable"
import { useSettings, type WidgetId } from "@/lib/settings"
import { useI18n } from "@/lib/i18n"
import { useDashboardBootstrap } from "@/hooks/use-dashboard-bootstrap"

const widgetMap: Record<WidgetId, React.ComponentType> = {
  time: TimeWeatherWidget,
  calendar: CalendarWidget,
  motivation: MotivationWidget,
  hardware: HardwareMonitor,
  notes: NotesWidget,
  music: MusicWidget,
}

function isWidgetVisible(id: WidgetId, settings: ReturnType<typeof useSettings>["settings"]) {
  if (id === "time") return true
  if (id === "calendar") return settings.showCalendar
  if (id === "motivation") return settings.showMotivation
  if (id === "hardware") return settings.showHardware
  if (id === "notes") return settings.showNotes
  if (id === "music") return settings.showMusic
  return true
}

export default function Dashboard() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { settings, updateSettings } = useSettings()
  const { t } = useI18n()
  const isDark =
    settings.theme === "dark" ||
    (settings.theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  useDashboardBootstrap()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const visibleOrder = useMemo(
    () => settings.widgetOrder.filter((id) => isWidgetVisible(id, settings)),
    [settings]
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = settings.widgetOrder.indexOf(active.id as WidgetId)
    const newIndex = settings.widgetOrder.indexOf(over.id as WidgetId)
    updateSettings({ widgetOrder: arrayMove(settings.widgetOrder, oldIndex, newIndex) })
  }

  return (
    <UpdaterProvider>
      <UpdaterSettingsBridge
        settingsOpen={settingsOpen}
        onCloseSettings={() => setSettingsOpen(false)}
      />
      <main className="dashboard-shell relative w-full bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? `radial-gradient(ellipse at 15% 10%, oklch(0.35 0.08 260 / 0.35), transparent 55%),
                 radial-gradient(ellipse at 85% 90%, oklch(0.32 0.1 300 / 0.25), transparent 50%)`
              : `radial-gradient(ellipse at 15% 10%, oklch(0.75 0.06 250 / 0.2), transparent 55%),
                 radial-gradient(ellipse at 85% 90%, oklch(0.8 0.05 280 / 0.15), transparent 50%)`,
          }}
        />
      </div>

      <Titlebar onSettingsClick={() => setSettingsOpen(true)} title={t("dashboard.title")} />

      <div className="dashboard-scroll custom-scrollbar">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleOrder} strategy={verticalListSortingStrategy}>
            <div className="dashboard-grid">
              {visibleOrder.map((id) => {
                const Component = widgetMap[id]
                return (
                  <SortableWidget key={id} id={id}>
                    <Component />
                  </SortableWidget>
                )
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <AIDock />

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </main>
      <UpdateDialog />
    </UpdaterProvider>
  )
}
