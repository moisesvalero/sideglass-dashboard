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
  message: string
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
  const [message, setMessage] = useState("")
  const [manual, setManual] = useState(false)
  const checkingRef = useRef(false)

  const check = useCallback(async (isManual: boolean) => {
    if (!isTauri() || checkingRef.current) return
    checkingRef.current = true
    setManual(isManual)
    setStatus("checking")
    setMessage("")
    try {
      const info = await checkForUpdates()
      if (info.available) {
        setVersion(info.version)
        setNotes(info.notes)
        setStatus("available")
      } else {
        setStatus(isManual ? "up-to-date" : "idle")
      }
    } catch {
      setStatus(isManual ? "error" : "idle")
      setMessage("error")
    } finally {
      checkingRef.current = false
    }
  }, [])

  const install = useCallback(async () => {
    if (!isTauri()) return
    setStatus("downloading")
    setPercent(0)
    let unlistenProgress = () => {}
    let unlistenFinished = () => {}
    try {
      unlistenProgress = await onUpdateProgress((p) => {
        setPercent(Math.min(100, Math.round(p.percent)))
      })
      unlistenFinished = await onUpdateFinished(() => setPercent(100))
      await installUpdate()
      setStatus("installed")
    } catch {
      setStatus("error")
      setMessage("install")
    } finally {
      unlistenProgress()
      unlistenFinished()
    }
  }, [])

  const restart = useCallback(async () => {
    await restartApp()
  }, [])

  const dismiss = useCallback(() => {
    setStatus("idle")
    setMessage("")
  }, [])

  // Auto check once on startup (non-blocking, silent if up to date).
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
        message,
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
