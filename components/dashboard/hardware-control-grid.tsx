"use client"

import type { ReactNode } from "react"
import { Cpu } from "lucide-react"
import type { MetricSensor } from "@/hooks/use-system-metrics"
import { useI18n } from "@/lib/i18n"

function tempClass(temp: number) {
  if (temp > 80) return "text-red-500"
  if (temp > 65) return "text-amber-500"
  return "text-emerald-500"
}

function barClass(value: number) {
  if (value > 90) return "bg-red-500"
  if (value > 75) return "bg-amber-500"
  return "bg-primary/80"
}

type TileProps = {
  sensor: MetricSensor
  primary: string
  secondary?: ReactNode
  footer?: ReactNode
}

function MetricTile({ sensor, primary, secondary, footer }: TileProps) {
  return (
    <div className="dashboard-surface dashboard-card-hover flex min-h-[7.25rem] flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
          {sensor.icon}
          <p className="metric-label">{sensor.label}</p>
        </div>
        {secondary ? <div className="shrink-0">{secondary}</div> : null}
      </div>
      <p className="metric-value mt-1">{primary}</p>
      <p className="metric-sublabel mt-auto pt-2">{sensor.subtitle}</p>
      <div className="capsule-bar mt-2">
        <div
          className={`capsule-bar-fill ${barClass(sensor.value)}`}
          style={{ width: `${Math.min(100, Math.max(0, sensor.value))}%` }}
        />
      </div>
      {footer ? <div className="mt-2">{footer}</div> : null}
    </div>
  )
}

type HardwareControlGridProps = {
  sensors: MetricSensor[]
  cpuMissingTemp: boolean
  activating: boolean
  onEnableSensors: () => void
  isLive: boolean
}

export function HardwareControlGrid({
  sensors,
  cpuMissingTemp,
  activating,
  onEnableSensors,
  isLive,
}: HardwareControlGridProps) {
  const { t } = useI18n()

  const cpu = sensors.find((s) => s.label === "CPU")
  const ram = sensors.find((s) => s.label === "RAM")
  const gpu = sensors.find((s) => s.label === "GPU")

  const cpuTempFooter =
    cpu && cpu.temp != null && cpu.temp > 0 ? (
      <span
        className={`inline-flex rounded-full bg-foreground/5 px-2 py-0.5 font-mono text-[11px] tabular-nums ${tempClass(cpu.temp)}`}
      >
        {Math.round(cpu.temp)}°C
      </span>
    ) : cpu && cpuMissingTemp ? (
      <button
        type="button"
        onClick={onEnableSensors}
        disabled={activating}
        className="w-full rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary transition-opacity hover:bg-primary/20 disabled:opacity-60"
      >
        {activating ? t("hardware.enablingSensors") : t("hardware.enableCpuTemp")}
      </button>
    ) : null

  return (
    <div className="widget-span-2 space-y-2">
      <div className="dashboard-widget-header px-0.5">
        <div className="dashboard-widget-title">
          <Cpu className="h-4 w-4 text-muted-foreground" />
          <span>{t("hardware.title")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="pulse-soft h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">
            {isLive ? t("hardware.live") : t("hardware.demo")}
          </span>
        </div>
      </div>

      <div className="hardware-control-grid">
        {cpu ? (
          <MetricTile
            sensor={cpu}
            primary={`${Math.round(cpu.value)}%`}
            secondary={cpuTempFooter}
          />
        ) : null}
        {ram ? <MetricTile sensor={ram} primary={`${Math.round(ram.value)}%`} /> : null}
        {gpu ? (
          <MetricTile
            sensor={gpu}
            primary={`${Math.round(gpu.value)}%`}
            secondary={
              gpu.temp != null && gpu.temp > 0 ? (
                <span
                  className={`inline-flex rounded-full bg-foreground/5 px-2 py-0.5 font-mono text-[11px] tabular-nums ${tempClass(gpu.temp)}`}
                >
                  {Math.round(gpu.temp)}°C
                </span>
              ) : null
            }
          />
        ) : null}
        <div className="dashboard-surface dashboard-card-hover flex min-h-[7.25rem] flex-col justify-between p-4">
          <div>
            <p className="metric-label">{t("hardware.statusTile")}</p>
            <p className="metric-value mt-1 text-lg">OK</p>
          </div>
          <p className="metric-sublabel">{t("hardware.statusTileHint")}</p>
        </div>
      </div>
    </div>
  )
}
