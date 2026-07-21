"use client"

import { useState, useEffect } from "react"
import { AiBrandIcon, resolveAiIconSrc } from "@/components/icons/ai-brand-icon"
import { AI_APPS } from "@/lib/ai-apps"
import { useSettings } from "@/lib/settings"
import { isTauri, openAiHub, openExternalUrl } from "@/lib/tauri"

function useIsDarkUi() {
  const { settings } = useSettings()
  const [isDark, setIsDark] = useState(() => settings.theme !== "light")

  useEffect(() => {
    if (settings.theme === "dark") {
      setIsDark(true)
      return
    }
    if (settings.theme === "light") {
      setIsDark(false)
      return
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const update = () => setIsDark(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [settings.theme])

  return isDark
}

export function AIDock() {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null)
  const isDark = useIsDarkUi()
  const { settings } = useSettings()

  if (!settings.showAi) return null

  return (
    <footer
      className="dashboard-dock-row shrink-0 z-40 w-full border-t border-border/50 px-2 pt-3 pb-5 flex justify-center pointer-events-none"
      aria-label="AI apps"
    >
      <div className="dock-glass rounded-2xl px-3 py-2.5 flex items-end justify-center gap-1.5 pointer-events-auto w-fit max-w-md">
        {AI_APPS.map((app) => {
          const isHovered = hoveredApp === app.id
          const iconSrc = resolveAiIconSrc(app.icon, isDark)
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => {
                if (isTauri()) {
                  void openAiHub(app.id)
                } else {
                  void openExternalUrl(app.url)
                }
              }}
              onMouseEnter={() => setHoveredApp(app.id)}
              onMouseLeave={() => setHoveredApp(null)}
              className={`
                relative flex items-center justify-center rounded-xl
                bg-muted/40 border border-border/60
                transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${isHovered ? "scale-125 -translate-y-2 shadow-lg" : "scale-100 hover:scale-110 hover:-translate-y-1"}
                w-12 h-12 sm:w-14 sm:h-14
              `}
              title={app.name}
              aria-label={app.name}
            >
              <AiBrandIcon src={iconSrc} className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />

              <span
                className={`
                  absolute -top-9 left-1/2 -translate-x-1/2
                  px-2.5 py-1 rounded-lg
                  bg-popover text-popover-foreground
                  text-[11px] font-medium whitespace-nowrap border border-border
                  shadow-md transition-all duration-200
                  ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"}
                `}
              >
                {app.name}
              </span>
            </button>
          )
        })}
      </div>
    </footer>
  )
}
