"use client"

import { Quote } from "lucide-react"

const quotes = [
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
  },
]

export function MotivationWidget() {
  const quote = quotes[0]

  return (
    <div className="glass-card p-5">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Quote className="w-4 h-4 text-white/60" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-white/90 text-sm leading-relaxed italic">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="text-white/50 text-xs mt-2">— {quote.author}</p>
        </div>
      </div>
    </div>
  )
}
