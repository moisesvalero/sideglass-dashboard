"use client"

import { useState } from "react"

// Official-style SVG icons for each AI
function ChatGPTIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364l2.0201-1.1685a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4091-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6099-1.4997Z" />
    </svg>
  )
}

function GeminiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 24C12 24 12 12 24 12C12 12 12 0 12 0C12 0 12 12 0 12C12 12 12 24 12 24Z"
        fill="url(#gemini-grad)"
      />
      <defs>
        <linearGradient id="gemini-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A73E8" />
          <stop offset="0.5" stopColor="#6C5CE7" />
          <stop offset="1" stopColor="#E91E63" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function ClaudeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.709 15.955l4.72-2.647.08-.08 2.726-1.529-2.646-1.449-4.8-2.567c-.639-.32-.639-1.289 0-1.609l6.329-3.538c.559-.32 1.279-.32 1.838 0l6.329 3.538c.639.32.639 1.289 0 1.609l-1.769.959 1.769.959c.639.32.639 1.289 0 1.609l-1.849 1.039 1.849 1.039c.639.32.639 1.289 0 1.609l-6.329 3.538c-.559.32-1.279.32-1.838 0l-6.329-3.538c-.639-.4-.639-1.289-.08-1.609v.239z" />
    </svg>
  )
}

function PerplexityIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L4 6v6l8 4 8-4V6l-8-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M12 22v-10M4 6l8 4M20 6l-8 4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path
        d="M12 2v6M4 12h4M16 12h4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function CopilotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
        fill="url(#copilot-grad)"
      />
      <path
        d="M8 14s1.5 2 4 2 4-2 4-2"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="10" r="1.5" fill="white" />
      <circle cx="15" cy="10" r="1.5" fill="white" />
      <defs>
        <linearGradient id="copilot-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0EA5E9" />
          <stop offset="0.5" stopColor="#6366F1" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const aiApps = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: <ChatGPTIcon className="w-7 h-7" />,
    color: "#10A37F",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(16,163,127,0.5)]",
    url: "https://chat.openai.com",
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: <GeminiIcon className="w-7 h-7" />,
    color: "#4285F4",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(66,133,244,0.5)]",
    url: "https://gemini.google.com",
  },
  {
    id: "claude",
    name: "Claude",
    icon: <ClaudeIcon className="w-7 h-7" />,
    color: "#D97757",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(217,119,87,0.5)]",
    url: "https://claude.ai",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    icon: <PerplexityIcon className="w-7 h-7" />,
    color: "#20B2AA",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(32,178,170,0.5)]",
    url: "https://perplexity.ai",
  },
  {
    id: "copilot",
    name: "Copilot",
    icon: <CopilotIcon className="w-7 h-7" />,
    color: "#6366F1",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]",
    url: "https://copilot.microsoft.com",
  },
]

export function AIDock() {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null)

  const handleClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="dock-glass rounded-[32px] px-4 py-3 flex items-center gap-2 shadow-2xl shadow-black/50">
        {aiApps.map((app) => (
          <button
            key={app.id}
            onClick={() => handleClick(app.url)}
            onMouseEnter={() => setHoveredApp(app.id)}
            onMouseLeave={() => setHoveredApp(null)}
            className={`
              relative w-14 h-14 rounded-2xl flex items-center justify-center
              transition-all duration-300 ease-out
              bg-white/10 backdrop-blur-sm
              border border-white/10
              ${app.hoverGlow}
              ${hoveredApp === app.id 
                ? "scale-125 -translate-y-3 bg-white/20 border-white/30" 
                : "hover:scale-110 hover:-translate-y-1"
              }
              active:scale-95
            `}
            style={{
              boxShadow: hoveredApp === app.id 
                ? `0 8px 32px ${app.color}40, inset 0 1px 0 rgba(255,255,255,0.2)` 
                : undefined
            }}
            title={app.name}
          >
            <span 
              className={`
                transition-all duration-300 
                ${hoveredApp === app.id ? "scale-110" : ""}
              `}
              style={{ 
                color: hoveredApp === app.id ? app.color : "rgba(255,255,255,0.85)",
                filter: hoveredApp === app.id ? `drop-shadow(0 0 8px ${app.color})` : undefined
              }}
            >
              {app.icon}
            </span>
            
            {/* Tooltip */}
            <span 
              className={`
                absolute -top-10 left-1/2 -translate-x-1/2
                px-3 py-1.5 rounded-lg
                bg-black/80 backdrop-blur-md
                text-xs font-medium text-white
                whitespace-nowrap
                border border-white/10
                transition-all duration-200
                ${hoveredApp === app.id 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-2 pointer-events-none"
                }
              `}
            >
              {app.name}
            </span>

            {/* Active dot indicator on hover */}
            <span 
              className={`
                absolute -bottom-1 left-1/2 -translate-x-1/2
                w-1.5 h-1.5 rounded-full
                transition-all duration-300
                ${hoveredApp === app.id ? "opacity-100 scale-100" : "opacity-0 scale-0"}
              `}
              style={{ backgroundColor: app.color, boxShadow: `0 0 8px ${app.color}` }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
