"use client"

import { useEffect, useState } from "react"
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, Loader2 } from "lucide-react"
import { useSettings } from "@/lib/settings"
import { useI18n } from "@/lib/i18n"

interface WeatherData {
  temp: number
  condition: string
  icon: string
  city: string
  humidity: number
  feelsLike: number
}

const weatherIcons: Record<string, React.ReactNode> = {
  "01": <Sun className="w-16 h-16 text-amber-400 weather-glow float-animation" />,
  "02": <Cloud className="w-16 h-16 text-white/80" />,
  "03": <Cloud className="w-16 h-16 text-white/60" />,
  "04": <Cloud className="w-16 h-16 text-white/50" />,
  "09": <CloudDrizzle className="w-16 h-16 text-blue-300" />,
  "10": <CloudRain className="w-16 h-16 text-blue-400" />,
  "11": <CloudLightning className="w-16 h-16 text-yellow-300" />,
  "13": <CloudSnow className="w-16 h-16 text-white/80" />,
  "50": <CloudFog className="w-16 h-16 text-white/40" />,
}

function getWeatherIcon(code: number): React.ReactNode {
  const prefix = code < 10 ? `0${code}` : `${code}`
  return weatherIcons[prefix] || weatherIcons[prefix.charAt(0) + "0"] || weatherIcons["01"]
}

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY || ""

export function TimeWeatherWidget() {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState<Date | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [weatherError, setWeatherError] = useState(false)
  const { settings } = useSettings()
  const { t } = useI18n()

  useEffect(() => {
    setMounted(true)
    setTime(new Date())
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchWeather = async () => {
      setWeatherLoading(true)
      setWeatherError(false)

      try {
        const city = settings.weatherCity || "Madrid"
        const units = settings.tempUnit === "fahrenheit" ? "imperial" : "metric"
        const apiKey = WEATHER_API_KEY

        if (!apiKey) {
          setWeatherError(true)
          setWeatherLoading(false)
          return
        }

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}&lang=es`,
          { signal: AbortSignal.timeout(5000) }
        )
        if (!res.ok) throw new Error("Weather fetch failed")

        const data = await res.json()
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].description,
          icon: `${data.weather[0].id}`,
          city: data.name,
          humidity: data.main.humidity,
          feelsLike: Math.round(data.main.feels_like),
        })
      } catch {
        setWeatherError(true)
      }
      setWeatherLoading(false)
    }

    fetchWeather()
    const weatherInterval = setInterval(fetchWeather, 600000)
    return () => clearInterval(weatherInterval)
  }, [mounted, settings.weatherCity, settings.tempUnit])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-6xl font-light tracking-tight text-white tabular-nums">
            {mounted && time ? formatTime(time) : "--:--"}
          </span>
          <span className="text-lg text-white/60 mt-1">
            {mounted && time ? formatDate(time) : t("time.loading")}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 min-w-[80px]">
          {weatherLoading ? (
            <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
          ) : weather ? (
            <>
              <div className="relative">
                {getWeatherIcon(parseInt(weather.icon) || 800)}
                <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full" />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-3xl font-light text-white">
                  {weather.temp}°{settings.tempUnit === "celsius" ? "" : "F"}
                </span>
                <span className="text-white/50 text-xs capitalize">{weather.condition}</span>
                <span className="text-white/30 text-xs">
                  {weather.city} · {weather.humidity}%
                </span>
              </div>
            </>
          ) : weatherError ? (
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <Sun className="w-16 h-16 text-amber-400 weather-glow float-animation" />
                <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full" />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-3xl font-light text-white">--°</span>
                <span className="text-white/40 text-xs">
                  {WEATHER_API_KEY ? t("weather.noData") : t("weather.setKey")}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
