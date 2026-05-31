"use client"

import { useState } from "react"

// Custom SVG icons for each AI
function GeminiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
        fill="url(#gemini-gradient)"
      />
      <defs>
        <linearGradient id="gemini-gradient" x1="2" y1="2" x2="22" y2="22">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="50%" stopColor="#9B72CB" />
          <stop offset="100%" stopColor="#D96570" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function ChatGPTIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364l2.0201-1.1685a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4091-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6099-1.4997Z" />
    </svg>
  )
}

function CopilotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="url(#copilot-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="copilot-gradient" x1="2" y1="2" x2="22" y2="22">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const aiApps = [
  {
    id: "gemini",
    name: "Gemini",
    icon: <GeminiIcon className="w-6 h-6" />,
    activeColor: "from-blue-500 via-purple-500 to-pink-500",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: <ChatGPTIcon className="w-6 h-6" />,
    activeColor: "from-emerald-400 to-teal-500",
  },
  {
    id: "copilot",
    name: "Copilot",
    icon: <CopilotIcon className="w-6 h-6" />,
    activeColor: "from-sky-400 to-indigo-500",
  },
]

export function AIDock() {
  const [activeApp, setActiveApp] = useState<string | null>(null)

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="dock-glass rounded-[28px] px-5 py-3.5 flex items-center gap-4 shadow-2xl shadow-black/50">
        {aiApps.map((app) => (
          <button
            key={app.id}
            onClick={() => setActiveApp(activeApp === app.id ? null : app.id)}
            className={`
              relative w-14 h-14 rounded-2xl flex items-center justify-center
              transition-all duration-300 ease-out
              ${
                activeApp === app.id
                  ? `bg-gradient-to-br ${app.activeColor} scale-110 shadow-lg shadow-white/20`
                  : "bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95"
              }
            `}
            title={app.name}
          >
            <span className={`transition-all duration-200 ${activeApp === app.id ? "text-white scale-110" : "text-white/80"}`}>
              {app.icon}
            </span>
            {activeApp === app.id && (
              <span className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
