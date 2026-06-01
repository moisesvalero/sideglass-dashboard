"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  checkForUpdates,
  dismissPendingUpdate,
  installUpdate,
  isTauri,
  onUpdateFinished,
  onUpdateProgress,
  restartApp,
} from "@/lib/tauri"

export type UpdateStatus =
  | "idle"
  | "checking"
  | "up-to-date"
  | "available"
  | "downloading"
  | "installed"
  | "error"

interface UpdaterContextValue {
  status: UpdateStatus
  version: string
  notes: string
  percent: number
  indeterminate: boolean
  downloadedMb: number
  errorDetail: string
  manual: boolean
  check: (manual: boolean) => Promise<void>
  install: () => Promise<void>
  restart: () => Promise<void>
  dismiss: () => void
}

const UpdaterContext = createContext<UpdaterContextValue | null>(null)

export function UpdaterProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<UpdateStatus>("idle")
  const [version, setVersion] = useState("")
  const [notes, setNotes] = useState("")
  const [percent, setPercent] = useState(0)
  const [indeterminate, setIndeterminate] = useState(false)
  const [downloadedMb, setDownloadedMb] = useState(0)
  const [errorDetail, setErrorDetail] = useState("")
  const [manual, setManual] = useState(false)
  const checkingRef = useRef(false)
  const installingRef = useRef(false)

  // Listen for progress before install starts (avoid missing early events).
  useEffect(() => {
    if (!isTauri()) return
    let unlistenProgress = () => {}
    let unlistenFinished = () => {}
    void (async () => {
      unlistenProgress = await onUpdateProgress((p) => {
        setPercent(Math.min(100, Math.round(p.percent)))
        setIndeterminate(p.indeterminate)
        setDownloadedMb(p.downloaded / (1024 * 1024))
      })
      unlistenFinished = await onUpdateFinished(() => {
        setPercent(100)
        setIndeterminate(false)
      })
    })()
    return () => {
      unlistenProgress()
      unlistenFinished()
    }
  }, [])

  const check = useCallback(async (isManual: boolean) => {
    if (!isTauri() || checkingRef.current || installingRef.current) return
    checkingRef.current = true
    setManual(isManual)
    setStatus("checking")
    setErrorDetail("")
    try {
      const info = await checkForUpdates()
      if (info.available) {
        setVersion(info.version)
        setNotes(info.notes)
        setStatus("available")
      } else {
        setStatus(isManual ? "up-to-date" : "idle")
      }
    } catch (e) {
      setStatus(isManual ? "error" : "idle")
      setErrorDetail(e instanceof Error ? e.message : "check_failed")
    } finally {
      checkingRef.current = false
    }
  }, [])

  const install = useCallback(async () => {
    if (!isTauri() || installingRef.current) return
    installingRef.current = true
    setStatus("downloading")
    setPercent(0)
    setIndeterminate(true)
    setDownloadedMb(0)
    setErrorDetail("")
    try {
      await installUpdate()
      setStatus("installed")
      setPercent(100)
    } catch (e) {
      setStatus("error")
      setErrorDetail(e instanceof Error ? e.message : "install_failed")
    } finally {
      installingRef.current = false
    }
  }, [])

  const restart = useCallback(async () => {
    await restartApp()
  }, [])

  const dismiss = useCallback(() => {
    if (isTauri()) void dismissPendingUpdate()
    setStatus("idle")
    setErrorDetail("")
  }, [])

  useEffect(() => {
    if (!isTauri()) return
    const timer = setTimeout(() => {
      void check(false)
    }, 4000)
    return () => clearTimeout(timer)
  }, [check])

  return (
    <UpdaterContext.Provider
      value={{
        status,
        version,
        notes,
        percent,
        indeterminate,
        downloadedMb,
        errorDetail,
        manual,
        check,
        install,
        restart,
        dismiss,
      }}
    >
      {children}
    </UpdaterContext.Provider>
  )
}

export function useUpdater(): UpdaterContextValue {
  const ctx = useContext(UpdaterContext)
  if (!ctx) {
    throw new Error("useUpdater must be used within UpdaterProvider")
  }
  return ctx
}

/** Cierra el drawer de ajustes cuando el modal de actualización necesita foco. */
export function UpdaterSettingsBridge({
  settingsOpen,
  onCloseSettings,
}: {
  settingsOpen: boolean
  onCloseSettings: () => void
}) {
  const { status } = useUpdater()
  useEffect(() => {
    if (
      settingsOpen &&
      (status === "available" || status === "downloading" || status === "installed")
    ) {
      onCloseSettings()
    }
  }, [status, settingsOpen, onCloseSettings])
  return null
}
