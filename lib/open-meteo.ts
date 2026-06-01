export interface WeatherResult {
  temp: number
  condition: string
  iconCode: number
  city: string
  humidity: number
  feelsLike: number
}

const WMO_LABELS: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla",
  51: "Llovizna",
  53: "Llovizna",
  55: "Llovizna",
  61: "Lluvia",
  63: "Lluvia",
  65: "Lluvia fuerte",
  71: "Nieve",
  73: "Nieve",
  75: "Nieve fuerte",
  80: "Chubascos",
  81: "Chubascos",
  82: "Chubascos fuertes",
  95: "Tormenta",
}

export function wmoToOpenWeatherIcon(code: number): string {
  if (code === 0) return "800"
  if (code <= 3) return "802"
  if (code <= 48) return "741"
  if (code <= 55) return "300"
  if (code <= 65) return "500"
  if (code <= 75) return "600"
  if (code <= 82) return "520"
  if (code >= 95) return "200"
  return "801"
}

async function geocode(city: string): Promise<{ lat: number; lon: number; name: string } | null> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es`,
    { signal: AbortSignal.timeout(8000) }
  )
  if (!res.ok) return null
  const data = await res.json()
  const r = data.results?.[0]
  if (!r) return null
  return { lat: r.latitude, lon: r.longitude, name: r.name }
}

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=es`,
    { signal: AbortSignal.timeout(8000) }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.results?.[0]?.name ?? null
}

export async function fetchWeather(options: {
  city: string
  useAutoLocation: boolean
  tempUnit: "celsius" | "fahrenheit"
}): Promise<WeatherResult> {
  let lat: number
  let lon: number
  let cityName = options.city

  if (options.useAutoLocation && typeof navigator !== "undefined" && navigator.geolocation) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 8000,
          maximumAge: 600_000,
        })
      })
      lat = pos.coords.latitude
      lon = pos.coords.longitude
      const rev = await reverseGeocode(lat, lon)
      if (rev) cityName = rev
    } catch {
      const geo = await geocode(options.city)
      if (!geo) throw new Error("Geocoding failed")
      lat = geo.lat
      lon = geo.lon
      cityName = geo.name
    }
  } else {
    const geo = await geocode(options.city)
    if (!geo) throw new Error("Geocoding failed")
    lat = geo.lat
    lon = geo.lon
    cityName = geo.name
  }

  const tempUnit = options.tempUnit === "fahrenheit" ? "fahrenheit" : "celsius"
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&temperature_unit=${tempUnit}`,
    { signal: AbortSignal.timeout(8000) }
  )
  if (!res.ok) throw new Error("Forecast failed")

  const data = await res.json()
  const c = data.current
  const code = c.weather_code as number

  return {
    temp: Math.round(c.temperature_2m),
    condition: WMO_LABELS[code] ?? "Desconocido",
    iconCode: code,
    city: cityName,
    humidity: c.relative_humidity_2m,
    feelsLike: Math.round(c.apparent_temperature),
  }
}
