"use client"

import { useEffect } from "react"
import { isTauri } from "@/lib/tauri"
import { useDashboardFullscreen } from "@/lib/dashboard-fullscreen"

/** F11 / Esc: immersive fullscreen (hides taskbar + custom titlebar). */
export function useTauriFullscreenHotkey() {
  const { isFullscreen, toggleFullscreen } = useDashboardFullscreen()

  useEffect(() => {
    if (!isTauri()) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F11") {
        event.preventDefault()
        void toggleFullscreen()
        return
      }
      if (event.key === "Escape" && isFullscreen) {
        event.preventDefault()
        void toggleFullscreen()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isFullscreen, toggleFullscreen])
}
