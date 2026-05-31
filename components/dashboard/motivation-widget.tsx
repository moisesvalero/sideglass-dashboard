"use client"

import { useEffect, useState } from "react"
import { Sun, Loader2 } from "lucide-react"

interface QuoteData {
  text: string
  author: string
}

const localQuotes: QuoteData[] = [
  { text: "El unico modo de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs" },
  { text: "No dejes que el ruido de las opiniones ajenas apague tu voz interior.", author: "Steve Jobs" },
  { text: "La mejor manera de predecir el futuro es crearlo.", author: "Peter Drucker" },
  { text: "En medio de la dificultad yace la oportunidad.", author: "Albert Einstein" },
  { text: "No es que sea muy inteligente, es que paso mas tiempo con los problemas.", author: "Albert Einstein" },
  { text: "Cada dia es una nueva oportunidad para cambiar tu vida.", author: "Anonimo" },
  { text: "El exito es la suma de pequenos esfuerzos repetidos dia tras dia.", author: "Robert Collier" },
  { text: "La disciplina es el puente entre las metas y los logros.", author: "Jim Rohn" },
  { text: "No te preocupes por los fallos. Preocupate por las posibilidades que pierdes cuando ni siquiera lo intentas.", author: "Jack Canfield" },
  { text: "El mejor momento para plantar un arbol fue hace 20 anos. El segundo mejor momento es ahora.", author: "Proverbio chino" },
  { text: "Caerse esta permitido. Levantarse es obligatorio.", author: "Proverbio ruso" },
  { text: "Lo imposible solo tarda un poco mas.", author: "Anonimo" },
  { text: "El experto en algo fue alguna vez un novato.", author: "Helen Hayes" },
  { text: "Si puedes sonarlo, puedes hacerlo.", author: "Walt Disney" },
  { text: "La unica forma de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs" },
  { text: "La vida es lo que pasa mientras estas ocupado haciendo otros planes.", author: "John Lennon" },
  { text: "El exito no es definitivo, el fracaso no es fatal: lo que cuenta es el valor para continuar.", author: "Winston Churchill" },
  { text: "Cree en ti mismo y en todo lo que eres. Debes saber que hay algo dentro de ti que es mas grande que cualquier obstaculo.", author: "Christian D. Larson" },
  { text: "No mires el reloj; haz lo que el hace: seguir avanzando.", author: "Sam Levenson" },
  { text: "La perseverancia no es una carrera larga; son muchas carreras cortas, una tras otra.", author: "Walter Elliot" },
]

export function MotivationWidget() {
  const [mounted, setMounted] = useState(false)
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)

  const getTodayKey = () => {
    const d = new Date()
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  }

  const fetchDailyQuote = async () => {
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
      } catch { /* ignore */ }
    }

    // Try multiple Spanish quote APIs
    const apis = [
      async (): Promise<QuoteData | null> => {
        const res = await fetch("https://frasesapi.vercel.app/v1/frases/random", {
          signal: AbortSignal.timeout(4000),
        })
        if (!res.ok) return null
        const data = await res.json()
        return { text: data.frase, author: data.autor || "Anonimo" }
      },
      async (): Promise<QuoteData | null> => {
        const res = await fetch("https://api.quotable.io/random?tags=motivation|inspirational&maxLength=120", {
          signal: AbortSignal.timeout(4000),
        })
        if (!res.ok) return null
        const data = await res.json()
        // Translate would be ideal, but just use as-is for English fallback
        return null
      },
    ]

    let dailyQuote: QuoteData | null = null

    for (const api of apis) {
      try {
        const result = await api()
        if (result) {
          dailyQuote = result
          break
        }
      } catch { /* try next */ }
    }

    // Fallback to random local quote
    if (!dailyQuote) {
      const idx = Math.floor(Math.random() * localQuotes.length)
      dailyQuote = localQuotes[idx]
    }

    localStorage.setItem("daily-quote", JSON.stringify({
      date: todayKey,
      quote: dailyQuote,
    }))

    setQuote(dailyQuote)
    setLoading(false)
    setMounted(true)
  }

  useEffect(() => {
    fetchDailyQuote()
  }, [])

  if (!mounted || loading) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">
            Frase del dia
          </h2>
        </div>
      </div>

      {quote && (
        <div className="flex gap-3">
          <div className="w-0.5 rounded-full bg-gradient-to-b from-amber-400 to-purple-500 flex-shrink-0" />
          <div>
            <p className="text-white/90 text-sm leading-relaxed italic">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="text-white/50 text-xs mt-2">
              — {quote.author}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
