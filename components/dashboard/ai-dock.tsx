"use client"

import { useState } from "react"
import { Sparkles, MessageSquare, Bot } from "lucide-react"

const aiApps = [
  {
    id: "gemini",
    name: "Gemini",
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-blue-500 to-purple-500",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: <MessageSquare className="w-5 h-5" />,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "copilot",
    name: "Copilot",
    icon: <Bot className="w-5 h-5" />,
    color: "from-sky-500 to-blue-500",
  },
]

export function AIDock() {
  const [activeApp, setActiveApp] = useState<string | null>(null)

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="dock-glass rounded-[28px] px-4 py-3 flex items-center gap-3">
        {aiApps.map((app) => (
          <button
            key={app.id}
            onClick={() => setActiveApp(activeApp === app.id ? null : app.id)}
            className={`
              relative w-12 h-12 rounded-2xl flex items-center justify-center
              transition-all duration-300 ease-out
              ${
                activeApp === app.id
                  ? `bg-gradient-to-br ${app.color} scale-110 shadow-lg shadow-white/10`
                  : "bg-white/10 hover:bg-white/20 hover:scale-105"
              }
            `}
            title={app.name}
          >
            <span className={activeApp === app.id ? "text-white" : "text-white/70"}>
              {app.icon}
            </span>
            {activeApp === app.id && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-white" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
