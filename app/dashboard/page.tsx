"use client"

import { useState, useMemo } from "react"
import {
  DndContext,
  rectIntersection,
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
  rectSortingStrategy,
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
import {
  DEFAULT_WIDGET_LAYOUTS,
  DEFAULT_WIDGET_ORDER,
  WIDGET_IDS,
  getDefaultWidgetLayouts,
  useSettings,
  type WidgetId,
  type WidgetLayout,
} from "@/lib/settings"
import { useI18n } from "@/lib/i18n"
import { useDashboardBootstrap } from "@/hooks/use-dashboard-bootstrap"
import { DashboardFullscreenProvider, useDashboardFullscreen } from "@/lib/dashboard-fullscreen"

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

function DashboardContent() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const { settings, updateSettings } = useSettings()
  const { t } = useI18n()
  const { isFullscreen } = useDashboardFullscreen()
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
    () =>
      settings.widgetOrder.filter(
        (id) => WIDGET_IDS.includes(id as WidgetId) && isWidgetVisible(id, settings)
      ),
    [settings]
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = settings.widgetOrder.indexOf(active.id as WidgetId)
    const newIndex = settings.widgetOrder.indexOf(over.id as WidgetId)
    updateSettings({ widgetOrder: arrayMove(settings.widgetOrder, oldIndex, newIndex) })
  }

  const handleLayoutChange = (id: WidgetId, layout: WidgetLayout) => {
    updateSettings({
      widgetLayouts: {
        ...settings.widgetLayouts,
        [id]: layout,
      },
    })
  }

  const resetLayout = () => {
    updateSettings({
      widgetOrder: [...DEFAULT_WIDGET_ORDER],
      widgetLayouts: getDefaultWidgetLayouts(),
    })
  }

  return (
    <UpdaterProvider>
      <UpdaterSettingsBridge
        settingsOpen={settingsOpen}
        onCloseSettings={() => setSettingsOpen(false)}
      />
      <main
        className={`dashboard-shell relative w-full bg-background${isFullscreen ? " dashboard-shell--immersive" : ""}`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? `radial-gradient(ellipse at 20% 0%, oklch(0.36 0.08 250 / 0.22), transparent 52%),
                 radial-gradient(ellipse at 90% 85%, oklch(0.28 0.08 295 / 0.18), transparent 48%),
                 linear-gradient(180deg, var(--dashboard-bg-elevated), var(--dashboard-bg))`
                : `radial-gradient(ellipse at 20% 0%, oklch(0.82 0.055 235 / 0.22), transparent 52%),
                 radial-gradient(ellipse at 90% 85%, oklch(0.86 0.035 285 / 0.18), transparent 48%),
                 linear-gradient(180deg, var(--dashboard-bg-elevated), var(--dashboard-bg))`,
            }}
          />
        </div>

        {!isFullscreen && (
          <Titlebar
            onSettingsClick={() => setSettingsOpen(true)}
            onCustomizeClick={() => setEditMode((value) => !value)}
            isCustomizing={editMode}
            title={t("dashboard.title")}
          />
        )}
        {isFullscreen && (
          <p
            className="pointer-events-none absolute left-1/2 top-2 z-[60] -translate-x-1/2 rounded-full border border-border/60 bg-background/85 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm"
            aria-live="polite"
          >
            {t("dashboard.exitFullscreenHint")}
          </p>
        )}

        <div className={`dashboard-scroll ${editMode ? "dashboard-scroll--editing" : ""}`}>
          {editMode && (
            <div className="dashboard-edit-toolbar">
              <span>{t("dashboard.customizeHint")}</span>
              <button type="button" onClick={resetLayout}>
                {t("dashboard.resetLayout")}
              </button>
            </div>
          )}
          <DndContext
            id="dashboard-widgets"
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={visibleOrder} strategy={rectSortingStrategy}>
              <div className="dashboard-grid">
                {visibleOrder.map((id) => {
                  const Component = widgetMap[id]
                  if (!Component) return null
                  return (
                    <SortableWidget
                      key={id}
                      id={id}
                      layout={settings.widgetLayouts[id] ?? DEFAULT_WIDGET_LAYOUTS[id]}
                      editMode={editMode}
                      onLayoutChange={handleLayoutChange}
                    >
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

export default function Dashboard() {
  return (
    <DashboardFullscreenProvider>
      <DashboardContent />
    </DashboardFullscreenProvider>
  )
}
