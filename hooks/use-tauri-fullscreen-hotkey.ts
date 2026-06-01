"use client"

import { useEffect } from "react"
import { isTauri, toggleFullscreen } from "@/lib/tauri"

/** F11 toggles borderless fullscreen when the dashboard window is focused (Tauri only). */
export function useTauriFullscreenHotkey() {
  useEffect(() => {
    if (!isTauri()) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "F11") return
      event.preventDefault()
      void toggleFullscreen()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])
}
