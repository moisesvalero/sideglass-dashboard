"use client"

import { useState } from "react"
import {
  ChatGPTIcon,
  GeminiIcon,
  ClaudeIcon,
  PerplexityIcon,
  CopilotIcon,
} from "@/components/icons/ai-icons"
import { openExternalUrl } from "@/lib/tauri"

const aiApps = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: ChatGPTIcon,
    url: "https://chatgpt.com",
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: GeminiIcon,
    url: "https://gemini.google.com",
  },
  {
    id: "claude",
    name: "Claude",
    icon: ClaudeIcon,
    url: "https://claude.ai",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    icon: PerplexityIcon,
    url: "https://www.perplexity.ai",
  },
  {
    id: "copilot",
    name: "Copilot",
    icon: CopilotIcon,
    url: "https://copilot.microsoft.com",
  },
]

export function AIDock() {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null)

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-2 w-full max-w-md pointer-events-none">
      <div className="dock-glass rounded-2xl px-3 py-2.5 flex items-end justify-center gap-1.5 pointer-events-auto mx-auto w-fit">
        {aiApps.map((app) => {
          const Icon = app.icon
          const isHovered = hoveredApp === app.id
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => void openExternalUrl(app.url)}
              onMouseEnter={() => setHoveredApp(app.id)}
              onMouseLeave={() => setHoveredApp(null)}
              className={`
                relative flex items-center justify-center rounded-xl
                bg-muted/40 border border-border/60
                transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${isHovered ? "scale-125 -translate-y-2 shadow-lg" : "scale-100 hover:scale-110 hover:-translate-y-1"}
                w-12 h-12 sm:w-14 sm:h-14
              `}
              title={app.name}
              aria-label={app.name}
            >
              <Icon className="w-7 h-7 sm:w-8 sm:h-8" />

              <span
                className={`
                  absolute -top-9 left-1/2 -translate-x-1/2
                  px-2.5 py-1 rounded-lg
                  bg-popover text-popover-foreground
                  text-[11px] font-medium whitespace-nowrap border border-border
                  shadow-md transition-all duration-200
                  ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"}
                `}
              >
                {app.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
