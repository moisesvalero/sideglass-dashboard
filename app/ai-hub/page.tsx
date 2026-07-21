"use client"

import { useState, useEffect, useCallback, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AiBrandIcon, resolveAiIconSrc } from "@/components/icons/ai-brand-icon"
import { AI_APPS, getAiAppById, isAiAppId } from "@/lib/ai-apps"
import { useSettings } from "@/lib/settings"
import {
  createOrUpdateAiWebview,
  listenToEvent,
  getCurrentTauriWindow,
  takeAiHubPendingTab,
} from "@/lib/tauri"
import { APP_VERSION } from "@/lib/site"
import { Minus, Square, X } from "lucide-react"

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

function AIHubContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "chatgpt"

  const [activeTab, setActiveTab] = useState(initialTab)
  const [mounted, setMounted] = useState(false)
  const [webviewError, setWebviewError] = useState<string | null>(null)
  const [webviewLoading, setWebviewLoading] = useState(false)
  const isDark = useIsDarkUi()

  const loadInFlight = useRef(false)
  const pendingTab = useRef<string | null>(null)
  const loadedTab = useRef<string | null>(null)
  const activeTabRef = useRef(initialTab)
  const initialLoadDone = useRef(false)

  activeTabRef.current = activeTab

  const loadWebview = useCallback(async (tabId: string) => {
    const targetApp = getAiAppById(tabId)
    if (!targetApp) return

    if (loadInFlight.current) {
      pendingTab.current = tabId
      return
    }

    if (loadedTab.current === tabId) return

    loadInFlight.current = true
    setWebviewLoading(true)
    setWebviewError(null)

    const maxAttempts = 3
    let lastError: string | null = null

    try {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          await createOrUpdateAiWebview(targetApp.id, targetApp.url)
          loadedTab.current = tabId
          lastError = null
          break
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          lastError = message
          const retryable = message.includes("ai-hub window not found")
          if (!retryable || attempt === maxAttempts - 1) {
            throw err
          }
          await new Promise((resolve) => window.setTimeout(resolve, 120 * (attempt + 1)))
        }
      }

      if (lastError) {
        throw new Error(lastError)
      }
    } catch (err) {
      loadedTab.current = null
      const message = err instanceof Error ? err.message : String(err)
      setWebviewError(message)
      console.error("[AI Hub] webview error:", message)
    } finally {
      loadInFlight.current = false
      setWebviewLoading(false)

      const nextTab = pendingTab.current
      pendingTab.current = null
      if (nextTab && nextTab !== tabId) {
        void loadWebview(nextTab)
      }
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Carga inicial: respeta pending tab de Rust o la pestaña activa del usuario
  useEffect(() => {
    if (!mounted || initialLoadDone.current) return

    let timer: number | undefined

    void (async () => {
      const pending = await takeAiHubPendingTab()
      const tab = isAiAppId(pending ?? "")
        ? pending!
        : isAiAppId(initialTab)
          ? initialTab
          : AI_APPS[0].id
      setActiveTab(tab)
      activeTabRef.current = tab

      timer = window.setTimeout(() => {
        if (initialLoadDone.current) return
        initialLoadDone.current = true
        const current = isAiAppId(activeTabRef.current) ? activeTabRef.current : tab
        void loadWebview(current)
      }, 200)
    })()

    return () => {
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [mounted, initialTab, loadWebview])

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return
    initialLoadDone.current = true
    setActiveTab(tabId)
    activeTabRef.current = tabId
    loadedTab.current = null
    void loadWebview(tabId)
  }

  useEffect(() => {
    if (!mounted) return

    let unlistenFn: (() => void) | null = null

    const setupListener = async () => {
      unlistenFn = await listenToEvent<string>("change-tab", (tabId) => {
        if (!isAiAppId(tabId)) return
        initialLoadDone.current = true
        setActiveTab(tabId)
        activeTabRef.current = tabId
        loadedTab.current = null
        void loadWebview(tabId)
      })
    }

    void setupListener()

    return () => {
      if (unlistenFn) unlistenFn()
    }
  }, [mounted, loadWebview])

  const handleWindowAction = async (action: "minimize" | "maximize" | "close") => {
    const win = await getCurrentTauriWindow()
    if (win) {
      if (action === "minimize") {
        await win.minimize()
      } else if (action === "maximize") {
        await win.toggleMaximize()
      } else if (action === "close") {
        await win.close()
      }
    }
  }

  if (!mounted) {
    return <div className="h-screen w-screen bg-background" />
  }

  return (
    <main className="flex flex-col h-screen w-screen overflow-hidden bg-background/85 backdrop-blur-xl text-foreground select-none animate-hub-fade-in">
      <div
        data-tauri-drag-region
        className="sticky top-0 z-50 flex h-11 w-full shrink-0 items-stretch select-none border-b border-border/40 bg-background/90 backdrop-blur-md"
      >
        <div data-tauri-drag-region className="flex min-w-0 shrink-0 items-center gap-2 px-4">
          <span className="truncate text-[13px] font-semibold leading-none text-foreground/80">
            AI Hub
          </span>
        </div>

        <div className="min-w-0 flex-1" data-tauri-drag-region aria-hidden />

        <div className="flex shrink-0 items-stretch" data-tauri-drag-region="false">
          <button
            type="button"
            onClick={() => handleWindowAction("minimize")}
            className="win-caption-btn w-12 flex items-center justify-center cursor-pointer"
            aria-label="Minimizar"
            title="Minimizar"
          >
            <Minus className="h-3.5 w-3.5 text-foreground" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => handleWindowAction("maximize")}
            className="win-caption-btn w-12 flex items-center justify-center cursor-pointer"
            aria-label="Maximizar"
            title="Maximizar"
          >
            <Square className="h-3 w-3 text-foreground" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => handleWindowAction("close")}
            className="win-caption-btn win-caption-close w-12 flex items-center justify-center cursor-pointer"
            aria-label="Cerrar"
            title="Cerrar"
          >
            <X className="h-4 w-4 text-foreground" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 w-full h-[calc(100vh-44px)] overflow-hidden">
        <section className="w-[260px] h-full border-r border-border/40 flex flex-col justify-between bg-background/40 backdrop-blur-md shrink-0 z-20">
          <div className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
            {AI_APPS.map((app) => {
              const isActive = activeTab === app.id
              const iconSrc = resolveAiIconSrc(app.icon, isDark)
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => handleTabChange(app.id)}
                  disabled={webviewLoading && isActive}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all select-none
                    ${
                      isActive
                        ? "bg-accent/80 text-accent-foreground shadow-sm border border-accent/20"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent"
                    }
                  `}
                >
                  <AiBrandIcon src={iconSrc} className="w-5 h-5 object-contain" />
                  <span>{app.name}</span>
                </button>
              )
            })}
          </div>

          <div className="p-3 border-t border-border/40 text-center text-[10px] text-muted-foreground/30 select-none shrink-0">
            Sideglass AI Hub v{APP_VERSION}
          </div>
        </section>

        <section className="relative flex-1 h-full bg-transparent">
          {webviewLoading && !webviewError && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/40 p-6 text-center backdrop-blur-[2px]">
              <p className="text-sm text-muted-foreground">Cargando plataforma…</p>
            </div>
          )}
          {webviewError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80 p-6 text-center backdrop-blur-sm">
              <p className="max-w-sm text-sm font-medium text-destructive">
                No se pudo cargar el panel de IA
              </p>
              <p className="max-w-md text-xs text-muted-foreground">{webviewError}</p>
              <button
                type="button"
                onClick={() => {
                  loadedTab.current = null
                  void loadWebview(activeTab)
                }}
                className="rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Reintentar
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default function AIHubPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-background" />}>
      <AIHubContent />
    </Suspense>
  )
}
