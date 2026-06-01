"use client"

import type { CSSProperties, PointerEvent, ReactNode } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Maximize2 } from "lucide-react"
import type { WidgetId, WidgetLayout } from "@/lib/settings"
import { useI18n } from "@/lib/i18n"

type SortableWidgetProps = {
  id: WidgetId
  layout: WidgetLayout
  editMode: boolean
  onLayoutChange: (id: WidgetId, layout: WidgetLayout) => void
  children: ReactNode
}

export function SortableWidget({
  id,
  layout,
  editMode,
  onLayoutChange,
  children,
}: SortableWidgetProps) {
  const { t } = useI18n()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.92 : 1,
    zIndex: isDragging ? 20 : undefined,
    "--widget-cols": layout.cols,
    "--widget-rows": layout.rows,
  } as CSSProperties

  const handleResizeStart = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const shell = event.currentTarget.closest<HTMLElement>(".widget-shell")
    const grid = shell?.closest<HTMLElement>(".dashboard-grid")
    if (!shell || !grid) return

    const startX = event.clientX
    const startY = event.clientY
    const start = { ...layout }
    const gridStyles = getComputedStyle(grid)
    const columnCount = gridStyles.gridTemplateColumns.split(" ").filter(Boolean).length || 1
    const rowSize = Number.parseFloat(gridStyles.gridAutoRows) || 8
    const gap = Number.parseFloat(gridStyles.gap) || 12
    const columnSize =
      (grid.clientWidth - gap * Math.max(0, columnCount - 1)) / Math.max(1, columnCount)

    const update = (move: globalThis.PointerEvent) => {
      const cols = Math.min(
        columnCount,
        Math.max(1, Math.round(start.cols + (move.clientX - startX) / (columnSize + gap)))
      )
      const rows = Math.min(
        34,
        Math.max(5, Math.round(start.rows + (move.clientY - startY) / (rowSize + gap)))
      )
      onLayoutChange(id, { cols, rows })
    }

    const cleanup = () => {
      window.removeEventListener("pointermove", update)
      window.removeEventListener("pointerup", cleanup)
    }

    window.addEventListener("pointermove", update)
    window.addEventListener("pointerup", cleanup)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`widget-shell group relative ${editMode ? "widget-editing" : ""} ${
        isDragging ? "scale-[1.01]" : ""
      }`}
    >
      <button
        type="button"
        className={`dashboard-control absolute right-3 top-3 z-20 flex h-7 w-7 cursor-grab items-center justify-center transition-opacity duration-150 active:cursor-grabbing ${
          editMode ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        }`}
        {...attributes}
        {...listeners}
        aria-label={t("dashboard.reorderWidget")}
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {children}
      {editMode && (
        <button
          type="button"
          onPointerDown={handleResizeStart}
          className="dashboard-resize-handle"
          aria-label={t("dashboard.resizeWidget")}
          title={t("dashboard.resizeWidget")}
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
