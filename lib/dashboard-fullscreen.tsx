"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { getCurrentTauriWindow, isTauri, invokeCommand } from "@/lib/tauri"

type DashboardFullscreenContextValue = {
  isFullscreen: boolean
  toggleFullscreen: () => Promise<void>
}

const DashboardFullscreenContext = createContext<DashboardFullscreenContextValue | null>(null)

export function DashboardFullscreenProvider({ children }: { children: ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const syncFullscreen = useCallback(async () => {
    if (!isTauri()) return
    const active = await invokeCommand<boolean>("is_immersive_fullscreen")
    setIsFullscreen(active)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    if (!isTauri()) return
    const next = await invokeCommand<boolean>("toggle_immersive_fullscreen")
    setIsFullscreen(next)
  }, [])

  useEffect(() => {
    if (!isTauri()) return

    let unlistenResize: (() => void) | undefined

    void (async () => {
      await syncFullscreen()

      const win = (await getCurrentTauriWindow()) as {
        onResized?: (handler: () => void) => Promise<() => void>
      } | null
      if (win?.onResized) {
        const unlisten = await win.onResized(() => {
          void syncFullscreen()
        })
        unlistenResize = unlisten
      }
    })()

    return () => {
      unlistenResize?.()
    }
  }, [syncFullscreen])

  const value = useMemo(
    () => ({ isFullscreen, toggleFullscreen }),
    [isFullscreen, toggleFullscreen]
  )

  return (
    <DashboardFullscreenContext.Provider value={value}>
      {children}
    </DashboardFullscreenContext.Provider>
  )
}

export function useDashboardFullscreen() {
  const ctx = useContext(DashboardFullscreenContext)
  if (!ctx) {
    throw new Error("useDashboardFullscreen must be used within DashboardFullscreenProvider")
  }
  return ctx
}
