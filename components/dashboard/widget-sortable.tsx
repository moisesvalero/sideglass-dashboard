"use client"

import type { ReactNode } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import type { WidgetId } from "@/lib/settings"

export function SortableWidget({ id, children }: { id: WidgetId; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.92 : 1,
    zIndex: isDragging ? 20 : undefined,
  }

  const spanClass = id === "time" || id === "hardware" || id === "music" ? "widget-span-2" : ""

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${spanClass} ${isDragging ? "scale-[1.01]" : ""}`}
    >
      <button
        type="button"
        className="dashboard-control absolute right-3 top-3 z-10 flex h-7 w-7 cursor-grab items-center justify-center opacity-0 transition-opacity duration-150 active:cursor-grabbing group-hover:opacity-100 focus-visible:opacity-100"
        {...attributes}
        {...listeners}
        aria-label="Reordenar"
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {children}
    </div>
  )
}
