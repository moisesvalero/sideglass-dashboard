"use client"

import { Settings } from "lucide-react"
import { isTauri } from "@/lib/tauri"

export function Titlebar({
  onSettingsClick,
  title,
}: {
  onSettingsClick: () => void
  title: string
}) {
  const tauriMode = isTauri()

  const handleMinimize = async () => {
    const win = await getTauriWindow()
    await win?.minimize()
  }
  const handleMaximize = async () => {
    const win = await getTauriWindow()
    await win?.toggleMaximize()
  }
  const handleClose = async () => {
    const win = await getTauriWindow()
    await win?.close()
  }

  return (
    <div
      data-tauri-drag-region
      className="sticky top-0 z-50 h-10 w-full shrink-0 flex items-center select-none bg-background/20 backdrop-blur-md border-b border-border/40"
    >
      {tauriMode ? (
        <div className="flex items-center gap-2 pl-4" data-tauri-drag-region="false">
          <button
            type="button"
            onClick={handleClose}
            className="traffic-light traffic-close"
            aria-label="Cerrar"
          />
          <button
            type="button"
            onClick={handleMinimize}
            className="traffic-light traffic-minimize"
            aria-label="Minimizar"
          />
          <button
            type="button"
            onClick={handleMaximize}
            className="traffic-light traffic-maximize"
            aria-label="Maximizar"
          />
        </div>
      ) : (
        <div className="w-24" />
      )}

      <span className="flex-1 text-center text-[11px] font-medium text-muted-foreground pointer-events-none truncate px-2">
        {title}
      </span>

      <button
        type="button"
        onClick={onSettingsClick}
        className="w-9 h-9 mr-2 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
        data-tauri-drag-region="false"
        aria-label="Ajustes"
      >
        <Settings className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  )
}

async function getTauriWindow() {
  try {
    if (!isTauri()) return null
    // @ts-expect-error Tauri global
    const { getCurrentWindow } = window.__TAURI__.window
    return getCurrentWindow()
  } catch {
    return null
  }
}
