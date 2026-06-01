"use client"

import { useEffect, useState } from "react"
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Loader2,
} from "lucide-react"
import { useSettings } from "@/lib/settings"
import { useI18n } from "@/lib/i18n"
import { fetchWeather, wmoToOpenWeatherIcon } from "@/lib/open-meteo"

interface WeatherData {
  temp: number
  condition: string
  iconCode: number
  city: string
  humidity: number
  feelsLike: number
}

const weatherIcons: Record<string, React.ReactNode> = {
  "01": <Sun className="h-12 w-12 text-amber-500 weather-glow float-animation" />,
  "02": <Cloud className="h-12 w-12 text-muted-foreground" />,
  "03": <Cloud className="h-12 w-12 text-muted-foreground/80" />,
  "04": <Cloud className="h-12 w-12 text-muted-foreground/60" />,
  "09": <CloudDrizzle className="h-12 w-12 text-sky-400" />,
  "10": <CloudRain className="h-12 w-12 text-sky-500" />,
  "11": <CloudLightning className="h-12 w-12 text-amber-400" />,
  "13": <CloudSnow className="h-12 w-12 text-muted-foreground" />,
  "50": <CloudFog className="h-12 w-12 text-muted-foreground/50" />,
  "741": <CloudFog className="h-12 w-12 text-muted-foreground/50" />,
  "800": <Sun className="h-12 w-12 text-amber-500 weather-glow float-animation" />,
}

function getWeatherIcon(code: number): React.ReactNode {
  const ow = wmoToOpenWeatherIcon(code)
  const prefix = ow.length >= 3 ? ow.slice(0, 3) : ow
  return weatherIcons[prefix] || weatherIcons[ow] || weatherIcons["800"]
}

export function TimeWeatherWidget() {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState<Date | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [weatherError, setWeatherError] = useState(false)
  const { settings } = useSettings()
  const { t, lang } = useI18n()

  useEffect(() => {
    setMounted(true)
    setTime(new Date())
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const load = async () => {
      setWeatherLoading(true)
      setWeatherError(false)
      try {
        const data = await fetchWeather({
          city: settings.weatherCity,
          useAutoLocation: settings.useAutoLocation,
          tempUnit: settings.tempUnit,
        })
        setWeather(data)
      } catch {
        setWeatherError(true)
      }
      setWeatherLoading(false)
    }

    load()
    const interval = setInterval(load, 600_000)
    return () => clearInterval(interval)
  }, [mounted, settings.weatherCity, settings.useAutoLocation, settings.tempUnit])

  const locale = lang === "es" ? "es-ES" : "en-US"
  const use12h = settings.timeFormat === "12"

  const formatTime = (date: Date) =>
    date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: use12h,
    })

  const formatDate = (date: Date) =>
    date.toLocaleDateString(locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
    })

  const tempSuffix = settings.tempUnit === "celsius" ? "°C" : "°F"

  return (
    <div className="glass-hero widget-span-2 p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[4rem] font-extralight leading-none tracking-[-0.035em] text-foreground tabular-nums sm:text-[4.75rem] lg:text-[5.25rem]">
            {mounted && time ? formatTime(time) : "--:--"}
          </p>
          <p className="mt-2 truncate text-[13px] capitalize text-muted-foreground">
            {mounted && time ? formatDate(time) : t("time.loading")}
          </p>
        </div>

        <div className="dashboard-control flex min-w-0 shrink-0 flex-row flex-wrap items-center gap-3 px-3.5 py-3 sm:max-w-[17rem]">
          {weatherLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : weather ? (
            <>
              {getWeatherIcon(weather.iconCode)}
              <span className="text-3xl font-light tabular-nums text-foreground sm:text-[2rem]">
                {weather.temp}
                {tempSuffix}
              </span>
              <div className="min-w-0 text-left">
                <span className="block max-w-[12rem] text-xs capitalize leading-snug text-muted-foreground sm:max-w-[9rem]">
                  {weather.condition}
                </span>
                <span className="text-[11px] text-muted-foreground/70">
                  {weather.city} · {weather.humidity}%
                </span>
              </div>
            </>
          ) : weatherError ? (
            <p className="max-w-[8rem] text-xs text-muted-foreground">{t("weather.setKey")}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
