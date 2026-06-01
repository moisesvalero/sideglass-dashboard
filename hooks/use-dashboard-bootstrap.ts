"use client"

import { useEffect } from "react"
import { useSettings } from "@/lib/settings"
import {
  isTauri,
  registerGlobalHotkey,
  setAutostart,
  invokeCommand,
  checkForUpdates,
} from "@/lib/tauri"
import { fetchIcal } from "@/lib/tauri"
import { parseIcalEvents } from "@/lib/ical"
import { useTauriFullscreenHotkey } from "@/hooks/use-tauri-fullscreen-hotkey"

const notifiedIds = new Set<string>()

export function useDashboardBootstrap() {
  const { settings } = useSettings()
  useTauriFullscreenHotkey()

  useEffect(() => {
    if (!isTauri()) return
    void setAutostart(settings.autostart)
  }, [settings.autostart])

  useEffect(() => {
    if (!isTauri()) return
    void registerGlobalHotkey(settings.globalHotkey)
  }, [settings.globalHotkey])

  useEffect(() => {
    if (!isTauri()) return
    const timer = setTimeout(() => {
      void checkForUpdates().catch(() => {
        /* sin release publicado aun */
      })
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isTauri() || !settings.calendarNotifications || !settings.calendarIcalUrl) return

    const check = async () => {
      try {
        const text = await fetchIcal(settings.calendarIcalUrl)
        const events = parseIcalEvents(text, 20)
        const now = Date.now()
        const in15 = 15 * 60 * 1000

        for (const e of events) {
          const diff = e.start.getTime() - now
          if (diff > 0 && diff <= in15 && !notifiedIds.has(e.id)) {
            notifiedIds.add(e.id)
            await invokeCommand("send_notification", {
              title: "Próximo evento",
              body: `${e.title} · ${e.start.toLocaleTimeString()}`,
            })
          }
        }
      } catch {
        /* ignore */
      }
    }

    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [settings.calendarNotifications, settings.calendarIcalUrl])
}
