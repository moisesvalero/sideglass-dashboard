"use client"

import { HelpCircle, Minus, Settings, Square, X } from "lucide-react"
import { isTauri, openExternalUrl } from "@/lib/tauri"
import { useI18n } from "@/lib/i18n"
import { SITE_URL } from "@/lib/site"

export function Titlebar({
  onSettingsClick,
  title,
}: {
  onSettingsClick: () => void
  title: string
}) {
  const tauriMode = isTauri()
  const { t, lang } = useI18n()

  const handleHelp = () => {
    const faqUrl = `${SITE_URL}${lang === "es" ? "/#faq" : "/en#faq"}`
    void openExternalUrl(faqUrl)
  }

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
      className="sticky top-0 z-50 flex h-10 w-full shrink-0 items-center select-none border-b border-border/40 bg-background/90 backdrop-blur-md"
    >
      <span className="pointer-events-none flex-1 truncate px-4 text-center text-[11px] font-medium text-muted-foreground">
        {title}
      </span>

      <div className="flex shrink-0 items-stretch" data-tauri-drag-region="false">
        <button
          type="button"
          onClick={handleHelp}
          className="win-caption-btn px-3"
          aria-label={t("titlebar.help")}
          title={t("titlebar.help")}
        >
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </button>
        <button
          type="button"
          onClick={onSettingsClick}
          className="win-caption-btn px-3"
          aria-label={t("titlebar.settings")}
          title={t("titlebar.settings")}
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
        </button>

        {tauriMode ? (
          <>
            <button
              type="button"
              onClick={handleMinimize}
              className="win-caption-btn w-12"
              aria-label="Minimizar"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={handleMaximize}
              className="win-caption-btn w-12"
              aria-label="Maximizar"
            >
              <Square className="h-3 w-3" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="win-caption-btn win-caption-close w-12"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </>
        ) : null}
      </div>
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
