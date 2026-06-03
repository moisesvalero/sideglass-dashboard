export interface WeatherResult {
  temp: number
  condition: string
  iconCode: number
  city: string
  humidity: number
  feelsLike: number
  latitude: number
  longitude: number
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

export interface CitySuggestion {
  id: number
  name: string
  /** "City, Region, Country" for display */
  label: string
  latitude: number
  longitude: number
}

function createFetchSignal(timeoutMs: number, signal?: AbortSignal) {
  const controller = new AbortController()
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs)

  if (signal) {
    if (signal.aborted) controller.abort()
    signal.addEventListener("abort", () => controller.abort(), { once: true })
  }

  return { signal: controller.signal, clear: () => globalThis.clearTimeout(timeout) }
}

async function fetchJson<T>(url: string, options?: { signal?: AbortSignal; timeoutMs?: number }) {
  const timeout = createFetchSignal(options?.timeoutMs ?? 8000, options?.signal)
  try {
    const res = await fetch(url, { signal: timeout.signal })
    if (!res.ok) return null
    return (await res.json()) as T
  } finally {
    timeout.clear()
  }
}

function normalizeToken(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function cityTokens(city: string) {
  return city
    .split(",")
    .map((part) => normalizeToken(part))
    .filter(Boolean)
}

type GeocodingResult = {
  id: number
  name: string
  admin1?: string
  country?: string
  country_code?: string
  latitude: number
  longitude: number
}

/** Live city search for the weather location autocomplete. */
export async function searchCities(
  query: string,
  lang = "es",
  signal?: AbortSignal
): Promise<CitySuggestion[]> {
  const q = query.trim()
  if (q.length < 2) return []
  try {
    const data = await fetchJson<{ results?: GeocodingResult[] }>(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=${lang}&format=json`,
      { signal }
    )
    const results = Array.isArray(data?.results) ? data.results : []
    return results.map((r): CitySuggestion => {
      const parts = [r.name, r.admin1, r.country].filter(Boolean)
      return {
        id: r.id,
        name: r.name,
        label: parts.join(", "),
        latitude: r.latitude,
        longitude: r.longitude,
      }
    })
  } catch {
    return []
  }
}

async function geocode(city: string): Promise<{ lat: number; lon: number; name: string } | null> {
  const trimmed = city.trim()
  const primaryName = trimmed.split(",")[0]?.trim() || trimmed
  if (primaryName.length < 2) return null

  const data = await fetchJson<{ results?: GeocodingResult[] }>(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(primaryName)}&count=10&language=es&format=json`
  )
  const results = Array.isArray(data?.results) ? data.results : []
  const desiredTokens = cityTokens(trimmed).slice(1)
  const r =
    [...results].sort((a, b) => {
      const score = (item: GeocodingResult) => {
        const label = normalizeToken(
          [item.name, item.admin1, item.country].filter(Boolean).join(", ")
        )
        return desiredTokens.reduce((sum, token) => sum + (label.includes(token) ? 1 : 0), 0)
      }
      return score(b) - score(a)
    })[0] ?? null
  if (!r) return null
  return { lat: r.latitude, lon: r.longitude, name: r.name }
}

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  const data = await fetchJson<{ results?: { name?: string }[] }>(
    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=es`
  )
  return data?.results?.[0]?.name ?? null
}

async function getBrowserPosition(): Promise<GeolocationPosition> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    throw new Error("Geolocation unavailable")
  }

  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15_000,
      maximumAge: 120_000,
    })
  })
}

export async function fetchWeather(options: {
  city: string
  useAutoLocation: boolean
  tempUnit: "celsius" | "fahrenheit"
}): Promise<WeatherResult> {
  let lat: number
  let lon: number
  let cityName = options.city.trim() || "Madrid"

  if (options.useAutoLocation) {
    try {
      const pos = await getBrowserPosition()
      if (pos.coords.accuracy && pos.coords.accuracy > 100_000) {
        throw new Error("Geolocation accuracy too low")
      }
      lat = pos.coords.latitude
      lon = pos.coords.longitude
      const rev = await reverseGeocode(lat, lon)
      if (rev) cityName = rev
    } catch (error) {
      const geo = await geocode(cityName)
      if (!geo) throw error
      lat = geo.lat
      lon = geo.lon
      cityName = geo.name
    }
  } else {
    const geo = await geocode(cityName)
    if (!geo) throw new Error("Geocoding failed")
    lat = geo.lat
    lon = geo.lon
    cityName = geo.name
  }

  const tempUnit = options.tempUnit === "fahrenheit" ? "fahrenheit" : "celsius"
  const data = await fetchJson<{
    current?: {
      temperature_2m: number
      relative_humidity_2m: number
      apparent_temperature: number
      weather_code: number
    }
  }>(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&temperature_unit=${tempUnit}`
  )
  const c = data?.current
  if (!c) throw new Error("Forecast failed")

  const code = c.weather_code as number

  return {
    temp: Math.round(c.temperature_2m),
    condition: WMO_LABELS[code] ?? "Desconocido",
    iconCode: code,
    city: cityName,
    humidity: c.relative_humidity_2m,
    feelsLike: Math.round(c.apparent_temperature),
    latitude: lat,
    longitude: lon,
  }
}
