"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import { searchCities, type CitySuggestion } from "@/lib/open-meteo"

interface Props {
  value: string
  onChange: (city: string) => void
  disabled?: boolean
  placeholder?: string
  lang?: string
}

export function CityAutocomplete({ value, onChange, disabled, placeholder, lang = "es" }: Props) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const justSelected = useRef(false)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    if (disabled) return
    if (justSelected.current) {
      justSelected.current = false
      return
    }
    const q = query.trim()
    if (q.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    const timer = setTimeout(async () => {
      const results = await searchCities(q, lang, controller.signal)
      setSuggestions(results)
      setOpen(results.length > 0)
      setLoading(false)
    }, 280)
    return () => {
      controller.abort()
      clearTimeout(timer)
      setLoading(false)
    }
  }, [query, disabled, lang])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const handleSelect = (s: CitySuggestion) => {
    justSelected.current = true
    setQuery(s.name)
    onChange(s.name)
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onChange(e.target.value)
        }}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true)
        }}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 disabled:opacity-50"
      />
      {loading && !disabled && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
          …
        </span>
      )}
      {open && !disabled && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-border bg-card/95 py-1 shadow-xl backdrop-blur-md">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => handleSelect(s)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
