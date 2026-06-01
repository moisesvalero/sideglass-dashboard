"use client"

import { useEffect, useState } from "react"
import { Sun, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface QuoteData {
  text: string
  author: string
}

const localQuotes: QuoteData[] = [
  { text: "El único modo de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs" },
  { text: "La mejor manera de predecir el futuro es crearlo.", author: "Peter Drucker" },
  { text: "En medio de la dificultad reside la oportunidad.", author: "Albert Einstein" },
  { text: "La disciplina es el puente entre las metas y los logros.", author: "Jim Rohn" },
  { text: "Si puedes soñarlo, puedes hacerlo.", author: "Walt Disney" },
  {
    text: "El éxito es la suma de pequeños esfuerzos repetidos cada día.",
    author: "Robert Collier",
  },
  { text: "No cuentes los días, haz que los días cuenten.", author: "Muhammad Ali" },
  { text: "La mente lo es todo. En lo que piensas, te conviertes.", author: "Buda" },
  { text: "Cae siete veces y levántate ocho.", author: "Proverbio japonés" },
  { text: "Lo que no te desafía, no te cambia.", author: "Fred DeVito" },
  { text: "Empieza donde estás, usa lo que tienes, haz lo que puedas.", author: "Arthur Ashe" },
  { text: "La calidad no es un acto, es un hábito.", author: "Aristóteles" },
]

function pickDailyQuote(key: string): QuoteData {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return localQuotes[hash % localQuotes.length]
}

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
    setQuote(pickDailyQuote(getTodayKey()))
    setLoading(false)
    setMounted(true)
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
