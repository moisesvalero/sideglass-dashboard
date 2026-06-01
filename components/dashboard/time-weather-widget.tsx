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
  "01": <Sun className="w-14 h-14 text-amber-500 weather-glow float-animation" />,
  "02": <Cloud className="w-14 h-14 text-muted-foreground" />,
  "03": <Cloud className="w-14 h-14 text-muted-foreground/80" />,
  "04": <Cloud className="w-14 h-14 text-muted-foreground/60" />,
  "09": <CloudDrizzle className="w-14 h-14 text-sky-400" />,
  "10": <CloudRain className="w-14 h-14 text-sky-500" />,
  "11": <CloudLightning className="w-14 h-14 text-amber-400" />,
  "13": <CloudSnow className="w-14 h-14 text-muted-foreground" />,
  "50": <CloudFog className="w-14 h-14 text-muted-foreground/50" />,
  "741": <CloudFog className="w-14 h-14 text-muted-foreground/50" />,
  "800": <Sun className="w-14 h-14 text-amber-500 weather-glow float-animation" />,
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
    <div className="glass-card p-6 widget-span-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <span className="text-5xl sm:text-6xl font-light tracking-tight text-foreground tabular-nums">
            {mounted && time ? formatTime(time) : "--:--"}
          </span>
          <span className="text-base text-muted-foreground mt-1 capitalize truncate">
            {mounted && time ? formatDate(time) : t("time.loading")}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 min-w-[88px] shrink-0">
          {weatherLoading ? (
            <Loader2 className="w-7 h-7 text-muted-foreground animate-spin" />
          ) : weather ? (
            <>
              {getWeatherIcon(weather.iconCode)}
              <div className="flex flex-col items-center gap-0.5 text-center">
                <span className="text-2xl font-light text-foreground tabular-nums">
                  {weather.temp}
                  {tempSuffix}
                </span>
                <span className="text-muted-foreground text-xs capitalize">
                  {weather.condition}
                </span>
                <span className="text-muted-foreground/70 text-[11px]">
                  {weather.city} · {weather.humidity}%
                </span>
              </div>
            </>
          ) : weatherError ? (
            <p className="text-xs text-muted-foreground text-center">{t("weather.setKey")}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
