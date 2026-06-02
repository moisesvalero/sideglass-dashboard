"use client"

import { useEffect, useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import dailyQuotes from "@/data/daily-quotes.json"

interface QuoteData {
  text: string
  author: string
}

type DailyQuote = {
  author: string
  text: Record<"es" | "en", string>
}

function pickDailyQuote(key: string, lang: "es" | "en"): QuoteData {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }

  const quotes = dailyQuotes as DailyQuote[]
  const quote = quotes[hash % quotes.length]

  return {
    text: quote.text[lang] || quote.text.es || quote.text.en,
    author: quote.author,
  }
}

export function MotivationWidget() {
  const [mounted, setMounted] = useState(false)
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const { t, lang } = useI18n()

  const getTodayKey = () => {
    const d = new Date()
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  }

  useEffect(() => {
    setQuote(pickDailyQuote(getTodayKey(), lang))
    setLoading(false)
    setMounted(true)
  }, [lang])

  if (!mounted || loading) {
    return (
      <div className="glass-tile flex justify-center p-5">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="glass-tile motivation-card overflow-hidden p-5">
      <div className="dashboard-widget-header mb-3">
        <div className="dashboard-widget-title">
          <Sparkles className="weather-glow h-4 w-4 text-amber-500" />
          <span>{t("motivation.title")}</span>
        </div>
      </div>

      {quote && (
        <blockquote className="motivation-note">
          <span className="motivation-quote-mark" aria-hidden>
            &quot;
          </span>
          <p className="motivation-quote">{quote.text}</p>
          <footer className="motivation-author">- {quote.author}</footer>
        </blockquote>
      )}
    </div>
  )
}
