"use client"

import { Settings, Minus, Square, X } from "lucide-react"
import { isTauri } from "@/lib/tauri"

export function Titlebar({ onSettingsClick, title }: { onSettingsClick: () => void; title: string }) {
  const tauriMode = isTauri()

  const handleMinimize = async () => {
    const win = await getTauriWindow()
    win?.minimize()
  }
  const handleMaximize = async () => {
    const win = await getTauriWindow()
    win?.toggleMaximize()
  }
  const handleClose = async () => {
    const win = await getTauriWindow()
    win?.close()
  }

  return (
    <div
      data-tauri-drag-region
      className="fixed top-0 left-0 right-0 z-50 h-9 flex items-center justify-between select-none"
    >
      <div className="flex items-center gap-2 pl-3">
        <button
          onClick={onSettingsClick}
          className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors"
          data-tauri-drag-region="false"
          aria-label="Ajustes"
        >
          <Settings className="w-3.5 h-3.5 text-white/50" />
        </button>
      </div>

      <span className="text-white/25 text-[11px] font-medium pointer-events-none">
        {title}
      </span>

      {tauriMode ? (
        <div className="flex items-center h-full" data-tauri-drag-region="false">
          <button
            onClick={handleMinimize}
            className="w-11 h-9 hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Minimizar"
          >
            <Minus className="w-3.5 h-3.5 text-white/60" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-11 h-9 hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Maximizar"
          >
            <Square className="w-3 h-3 text-white/60" />
          </button>
          <button
            onClick={handleClose}
            className="w-11 h-9 hover:bg-red-500/80 flex items-center justify-center transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
          </button>
        </div>
      ) : (
        <div className="w-[132px]" />
      )}
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
