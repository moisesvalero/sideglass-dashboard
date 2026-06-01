"use client"

import { useState } from "react"
import { Youtube, X } from "lucide-react"
import { useI18n } from "@/lib/i18n"

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

  const handlePlayLink = () => {
    const id = extractVideoId(linkInput.trim())
    if (id) setVideoId(id)
  }

  return (
    <div className="glass-card widget-span-2 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Youtube className="h-4 w-4 text-red-500" />
          <h2 className="widget-title">{t("music.title")}</h2>
        </div>
        {videoId && (
          <button
            type="button"
            onClick={() => {
              setVideoId(null)
              setLinkInput("")
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted"
            aria-label="Cerrar video"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{t("music.embedHint")}</p>

      <div className="flex gap-2">
        <input
          type="text"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePlayLink()}
          placeholder={t("music.paste")}
          className="min-w-0 flex-1 rounded-xl border border-border bg-muted/60 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
        />
        {linkInput.trim() && (
          <button
            type="button"
            onClick={handlePlayLink}
            className="shrink-0 rounded-xl bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
          >
            {t("music.play")}
          </button>
        )}
      </div>

      {videoId ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-border bg-black/80">
          <div className="relative" style={{ paddingBottom: "56.25%" }}>
            <iframe
              title="YouTube"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      ) : (
        <div className="mt-3 flex aspect-video items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 text-center text-xs text-muted-foreground">
          {t("music.empty")}
        </div>
      )}
    </div>
  )
}
