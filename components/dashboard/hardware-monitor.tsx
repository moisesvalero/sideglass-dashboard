"use client"

import { useI18n } from "@/lib/i18n"
import { useSystemMetrics } from "@/hooks/use-system-metrics"
import { HardwareControlGrid } from "@/components/dashboard/hardware-control-grid"

export function HardwareMonitor() {
  const { t } = useI18n()
  const {
    sensors,
    isRunningInTauri,
    cpuMissingTemp,
    sensorWarmup,
    cpuTempReady,
    activating,
    activationFailed,
    activationError,
    handleEnableSensors,
  } = useSystemMetrics()

  const activationHint = (() => {
    if (!activationFailed) return t("hardware.cpuTempHint")
    const code = activationError ?? ""
    if (code.includes("user_cancelled_uac")) return t("hardware.pawnioUacCancelled")
    if (code.includes("pawnio_setup_missing")) return t("hardware.pawnioSetupMissing")
    if (code.includes("sensor_init_failed")) return t("hardware.sensorInitFailed")
    if (code.includes("sensor_timeout")) return t("hardware.sensorTimeout")
    if (code.includes("pawnio_not_installed")) return t("hardware.pawnioFailed")
    if (code.includes("pawnio")) return t("hardware.pawnioFailed")
    return t("hardware.sensorsFailed")
  })()

  return (
    <div className="space-y-2">
      <HardwareControlGrid
        sensors={sensors}
        cpuMissingTemp={cpuMissingTemp}
        activating={activating}
        onEnableSensors={() => void handleEnableSensors()}
        isLive={isRunningInTauri}
      />

      {isRunningInTauri && sensorWarmup && !cpuTempReady && (
        <p className="px-1 text-center text-xs text-muted-foreground">
          {t("hardware.sensorsLoading")}
        </p>
      )}
      {cpuMissingTemp && (
        <p className="px-1 text-center text-xs leading-relaxed text-muted-foreground">
          {activationHint}
        </p>
      )}
      {!isRunningInTauri && (
        <p className="px-1 text-center text-xs text-muted-foreground">{t("hardware.tauriHint")}</p>
      )}
    </div>
  )
}
