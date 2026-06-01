"use client"

import { useState } from "react"
import { Youtube, X, ExternalLink } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { openYoutubeWindow } from "@/lib/tauri"

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:v=|\/)([\w-]{11})(?:[?&]|$)/,
    /youtu\.be\/([\w-]{11})/,
    /embed\/([\w-]{11})/,
  ]
  for (const p of patterns) {
    const match = url.match(p)
    if (match) return match[1]
  }
  return null
}

export function MusicWidget() {
  const [linkInput, setLinkInput] = useState("")
  const [videoId, setVideoId] = useState<string | null>(null)
  const { t } = useI18n()

  const handleOpenYoutube = () => {
    void openYoutubeWindow()
  }

  const handlePlayLink = () => {
    const id = extractVideoId(linkInput.trim())
    if (id) setVideoId(id)
  }

  return (
    <div className="glass-card p-5 widget-span-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Youtube className="w-4 h-4 text-red-500" />
          <h2 className="widget-title">{t("music.title")}</h2>
        </div>
        {videoId && (
          <button
            type="button"
            onClick={() => {
              setVideoId(null)
              setLinkInput("")
            }}
            className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center"
            aria-label="Cerrar video"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleOpenYoutube}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/90 hover:bg-red-500 text-white text-sm font-medium transition-colors mb-3"
      >
        <ExternalLink className="w-4 h-4" />
        {t("music.open")}
      </button>
      <p className="text-muted-foreground text-xs mb-3 leading-relaxed">{t("music.openHint")}</p>

      <div className="flex gap-2">
        <input
          type="text"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePlayLink()}
          placeholder={t("music.paste")}
          className="flex-1 bg-muted/60 rounded-xl px-3 py-2 text-sm text-foreground outline-none border border-border placeholder:text-muted-foreground/50 min-w-0"
        />
        {linkInput.trim() && (
          <button
            type="button"
            onClick={handlePlayLink}
            className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors shrink-0"
          >
            Play
          </button>
        )}
      </div>

      {videoId && (
        <div className="rounded-xl overflow-hidden bg-black/80 mt-3 border border-border">
          <div className="relative" style={{ paddingBottom: "56.25%" }}>
            <iframe
              title="YouTube"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}
