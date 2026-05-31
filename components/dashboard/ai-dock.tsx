"use client"

import { useState } from "react"

function ChatGPTIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" className={className}>
      <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
    </svg>
  )
}

function GeminiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 24C12 24 12 12 24 12C12 12 12 0 12 0C12 0 12 12 0 12C12 12 12 24 12 24Z" />
    </svg>
  )
}

function ClaudeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
    </svg>
  )
}

function PerplexityIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M24 4.5v39M13.73 16.573v-9.99L24 16.573m0 14.5L13.73 41.417V27.01L24 16.573m0 0l10.27-9.99v9.99"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13.73 31.396H9.44V16.573h29.12v14.823h-4.29"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M24 16.573L34.27 27.01v14.407L24 31.073"
      />
    </svg>
  )
}

function CopilotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="none" className={className}>
      <path
        d="M205.3 31.4c14 14.8 20 35.2 22.5 63.6 6.6 0 12.8 1.5 17 7.2l7.8 10.6c2.2 3 3.4 6.6 3.4 10.4v28.7a12 12 0 0 1-4.8 9.5C215.9 187.2 172.3 208 128 208c-49 0-98.2-28.3-123.2-46.6a12 12 0 0 1-4.8-9.5v-28.7c0-3.8 1.2-7.4 3.4-10.5l7.8-10.5c4.2-5.7 10.4-7.2 17-7.2 2.5-28.4 8.4-48.8 22.5-63.6C77.3 3.2 112.6 0 127.6 0h.4c14.7 0 50.4 2.9 77.3 31.4ZM128 78.7c-3 0-6.5.2-10.3.6a27.1 27.1 0 0 1-6 12.1 45 45 0 0 1-32 13c-6.8 0-13.9-1.5-19.7-5.2-5.5 1.9-10.8 4.5-11.2 11-.5 12.2-.6 24.5-.6 36.8 0 6.1 0 12.3-.2 18.5 0 3.6 2.2 6.9 5.5 8.4C79.9 185.9 105 192 128 192s48-6 74.5-18.1a9.4 9.4 0 0 0 5.5-8.4c.3-18.4 0-37-.8-55.3-.4-6.6-5.7-9.1-11.2-11-5.8 3.7-13 5.1-19.7 5.1a45 45 0 0 1-32-12.9 27.1 27.1 0 0 1-6-12.1c-3.4-.4-6.9-.5-10.3-.6Zm-27 44c5.8 0 10.5 4.6 10.5 10.4v19.2a10.4 10.4 0 0 1-20.8 0V133c0-5.8 4.6-10.4 10.4-10.4Zm53.4 0c5.8 0 10.4 4.6 10.4 10.4v19.2a10.4 10.4 0 0 1-20.8 0V133c0-5.8 4.7-10.4 10.4-10.4Zm-73-94.4c-11.2 1.1-20.6 4.8-25.4 10-10.4 11.3-8.2 40.1-2.2 46.2A31.2 31.2 0 0 0 75 91.7c6.8 0 19.6-1.5 30.1-12.2 4.7-4.5 7.5-15.7 7.2-27-.3-9.1-2.9-16.7-6.7-19.9-4.2-3.6-13.6-5.2-24.2-4.3Zm69 4.3c-3.8 3.2-6.4 10.8-6.7 19.9-.3 11.3 2.5 22.5 7.2 27a41.7 41.7 0 0 0 30 12.2c8.9 0 17-2.9 21.3-7.2 6-6.1 8.2-34.9-2.2-46.3-4.8-5-14.2-8.8-25.4-9.9-10.6-1-20 .7-24.2 4.3ZM128 56c-2.6 0-5.6.2-9 .5.4 1.7.5 3.7.7 5.7 0 1.5 0 3-.2 4.5 3.2-.3 6-.3 8.5-.3 2.6 0 5.3 0 8.5.3-.2-1.6-.2-3-.2-4.5.2-2 .3-4 .7-5.7-3.4-.3-6.4-.5-9-.5Z"
        fill="currentColor"
      />
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
