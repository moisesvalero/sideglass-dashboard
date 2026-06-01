"use client"

import { Download, RotateCw, X, CheckCircle2, AlertTriangle } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useUpdater } from "@/lib/updater"

export function UpdateDialog() {
  const { t } = useI18n()
  const { status, version, notes, percent, install, restart, dismiss } = useUpdater()

  const visible =
    status === "available" ||
    status === "downloading" ||
    status === "installed" ||
    status === "error"

  if (!visible) return null

  const dismissable = status === "available" || status === "error"

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-dialog-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={dismissable ? dismiss : undefined}
        aria-hidden
      />
      <div className="glass-panel relative w-full max-w-md rounded-2xl border border-border bg-card/90 p-6 shadow-2xl">
        {dismissable && (
          <button
            type="button"
            onClick={dismiss}
            aria-label={t("update.close")}
            className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {status === "available" && (
          <>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Download className="h-5 w-5" />
              </span>
              <div>
                <h2
                  id="update-dialog-title"
                  className="text-base font-semibold text-foreground"
                >
                  {t("update.foundTitle")}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t("update.version")} {version}
                </p>
              </div>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">{t("update.foundDesc")}</p>
            {notes.trim() && (
              <div className="mb-4 max-h-40 overflow-y-auto rounded-xl border border-border bg-muted/40 p-3">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {t("update.notesTitle")}
                </p>
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground/90">
                  {notes.trim()}
                </pre>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={dismiss}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                {t("update.later")}
              </button>
              <button
                type="button"
                onClick={() => void install()}
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {t("update.install")}
              </button>
            </div>
          </>
        )}

        {status === "downloading" && (
          <>
            <h2 id="update-dialog-title" className="mb-1 text-base font-semibold text-foreground">
              {t("update.downloadingTitle")}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">{t("update.downloadingDesc")}</p>
            <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-right text-xs tabular-nums text-muted-foreground">{percent}%</p>
          </>
        )}

        {status === "installed" && (
          <>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <h2 id="update-dialog-title" className="text-base font-semibold text-foreground">
                {t("update.installedTitle")}
              </h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{t("update.installedDesc")}</p>
            <button
              type="button"
              onClick={() => void restart()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <RotateCw className="h-4 w-4" />
              {t("update.restart")}
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <h2 id="update-dialog-title" className="text-base font-semibold text-foreground">
                {t("update.errorTitle")}
              </h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{t("update.errorDesc")}</p>
            <button
              type="button"
              onClick={dismiss}
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {t("update.close")}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
