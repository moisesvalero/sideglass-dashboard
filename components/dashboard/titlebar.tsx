"use client"

import { Settings } from "lucide-react"
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
      className="fixed top-0 left-0 right-0 z-50 h-10 flex items-center justify-between px-3 select-none"
    >
      <div className="flex items-center gap-2">
        {tauriMode && (
          <>
            <button
              onClick={handleMinimize}
              className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-300 transition-colors group/wc flex items-center justify-center"
              data-tauri-drag-region="false"
              aria-label="Minimizar"
            >
              <span className="opacity-0 group-hover/wc:opacity-100 text-[8px] text-black/70 font-bold leading-none">
                &#8722;
              </span>
            </button>
            <button
              onClick={handleMaximize}
              className="w-3 h-3 rounded-full bg-emerald-400 hover:bg-emerald-300 transition-colors group/wc flex items-center justify-center"
              data-tauri-drag-region="false"
              aria-label="Maximizar"
            >
              <span className="opacity-0 group-hover/wc:opacity-100 text-[8px] text-black/70 font-bold leading-none">
                &#9744;
              </span>
            </button>
            <button
              onClick={handleClose}
              className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-300 transition-colors group/wc flex items-center justify-center"
              data-tauri-drag-region="false"
              aria-label="Cerrar"
            >
              <span className="opacity-0 group-hover/wc:opacity-100 text-[8px] text-black/70 font-bold leading-none">
                &#10005;
              </span>
            </button>
          </>
        )}
      </div>
      <span className="text-white/30 text-xs font-medium pointer-events-none">
        {title}
      </span>
      <button
        onClick={onSettingsClick}
        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        data-tauri-drag-region="false"
        aria-label="Ajustes"
      >
        <Settings className="w-3.5 h-3.5 text-white/60" />
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
