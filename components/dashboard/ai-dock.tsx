"use client"

import { useState, useEffect } from "react"
import { Bot } from "lucide-react"
import { AiBrandIcon, resolveAiIconSrc } from "@/components/icons/ai-brand-icon"
import { AI_APPS } from "@/lib/ai-apps"
import { useSettings } from "@/lib/settings"
import { useI18n } from "@/lib/i18n"
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
  const { t } = useI18n()

  return (
    <div className="glass-tile flex h-full min-h-0 flex-col overflow-hidden p-3 sm:p-4">
      <div className="dashboard-widget-header mb-2 shrink-0">
        <div className="dashboard-widget-title">
          <Bot className="h-4 w-4 text-sky-400" />
          <span>{t("ai.title")}</span>
        </div>
      </div>

      <div className="custom-scrollbar flex flex-1 items-center justify-center flex-wrap gap-2 overflow-y-auto p-1 sm:gap-3">
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
                relative flex h-11 w-11 items-center justify-center rounded-xl
                bg-muted/40 border border-border/60
                transition-all duration-200 ease-out
                ${isHovered ? "scale-110 -translate-y-1 shadow-md bg-muted/80" : "scale-100 hover:scale-105"}
                sm:h-13 sm:w-13 md:h-14 md:w-14
              `}
              title={app.name}
              aria-label={app.name}
            >
              <AiBrandIcon
                src={iconSrc}
                className="h-6 w-6 object-contain sm:h-7 sm:w-7 md:h-8 md:w-8"
              />

              <span
                className={`
                  absolute -top-9 left-1/2 -translate-x-1/2
                  px-2.5 py-1 rounded-lg
                  bg-popover text-popover-foreground
                  text-[11px] font-medium whitespace-nowrap border border-border
                  shadow-md transition-all duration-200 z-30
                  ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"}
                `}
              >
                {app.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
