"use client"

import { useEffect, useState } from "react"
import { Sun, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface QuoteData {
  text: string
  author: string
}

const localQuotes: QuoteData[] = [
  { text: "El unico modo de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs" },
  { text: "La mejor manera de predecir el futuro es crearlo.", author: "Peter Drucker" },
  { text: "En medio de la dificultad yace la oportunidad.", author: "Albert Einstein" },
  { text: "La disciplina es el puente entre las metas y los logros.", author: "Jim Rohn" },
  { text: "Si puedes sonarlo, puedes hacerlo.", author: "Walt Disney" },
]

export function MotivationWidget() {
  const [mounted, setMounted] = useState(false)
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useI18n()

  const getTodayKey = () => {
    const d = new Date()
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const todayKey = getTodayKey()
      const stored = localStorage.getItem("daily-quote")

      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed.date === todayKey && parsed.quote) {
            setQuote(parsed.quote)
            setLoading(false)
            setMounted(true)
            return
          }
        } catch {
          /* ignore */
        }
      }

      let dailyQuote: QuoteData | null = null

      try {
        const res = await fetch("https://frasesapi.vercel.app/v1/frases/random", {
          signal: AbortSignal.timeout(4000),
        })
        if (res.ok) {
          const data = await res.json()
          dailyQuote = { text: data.frase, author: data.autor || "Anonimo" }
        }
      } catch {
        /* fallback */
      }

      if (!dailyQuote) {
        dailyQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)]
      }

      localStorage.setItem("daily-quote", JSON.stringify({ date: todayKey, quote: dailyQuote }))
      setQuote(dailyQuote)
      setLoading(false)
      setMounted(true)
    }

    load()
  }, [])

  if (!mounted || loading) {
    return (
      <div className="glass-card p-5">
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sun className="w-4 h-4 text-amber-500" />
        <h2 className="widget-title">{t("motivation.title")}</h2>
      </div>

      {quote && (
        <div className="flex gap-3">
          <div className="w-0.5 rounded-full bg-gradient-to-b from-amber-400 to-primary flex-shrink-0" />
          <div>
            <p className="text-foreground text-sm leading-relaxed italic">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="text-muted-foreground text-xs mt-2">— {quote.author}</p>
          </div>
        </div>
      )}
    </div>
  )
}
