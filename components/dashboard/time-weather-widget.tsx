"use client"

import { useEffect, useState } from "react"
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Loader2,
  Sun,
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

const iconClass = "time-weather-icon"

const weatherIcons: Record<string, React.ReactNode> = {
  "01": <Sun className={`${iconClass} text-amber-500 weather-glow float-animation`} />,
  "02": <Cloud className={`${iconClass} text-muted-foreground`} />,
  "03": <Cloud className={`${iconClass} text-muted-foreground/80`} />,
  "04": <Cloud className={`${iconClass} text-muted-foreground/60`} />,
  "09": <CloudDrizzle className={`${iconClass} text-sky-400`} />,
  "10": <CloudRain className={`${iconClass} text-sky-500`} />,
  "11": <CloudLightning className={`${iconClass} text-amber-400`} />,
  "13": <CloudSnow className={`${iconClass} text-muted-foreground`} />,
  "50": <CloudFog className={`${iconClass} text-muted-foreground/50`} />,
  "741": <CloudFog className={`${iconClass} text-muted-foreground/50`} />,
  "800": <Sun className={`${iconClass} text-amber-500 weather-glow float-animation`} />,
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
    <div className="glass-hero time-weather-widget widget-span-2 p-5 sm:p-6">
      <div className="time-weather-layout">
        <div className="time-weather-clock min-w-0 flex-1">
          <p className="time-weather-time">{mounted && time ? formatTime(time) : "--:--"}</p>
          <p className="time-weather-date">
            {mounted && time ? formatDate(time) : t("time.loading")}
          </p>
        </div>

        <div className="dashboard-control time-weather-panel">
          {weatherLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : weather ? (
            <>
              {getWeatherIcon(weather.iconCode)}
              <span className="time-weather-temp">
                {weather.temp}
                {tempSuffix}
              </span>
              <div className="time-weather-meta min-w-0 text-left">
                <span className="time-weather-condition">{weather.condition}</span>
                <span className="time-weather-city">
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
