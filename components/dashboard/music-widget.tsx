"use client"

import { useState } from "react"
import { Youtube, X, Search, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { isTauri, youtubeSearch, type YoutubeResult } from "@/lib/tauri"

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
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<YoutubeResult[]>([])
  const [videoId, setVideoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useI18n()
  const searchEnabled = isTauri()

  const handleSearch = async () => {
    const q = query.trim()
    if (!q) return

    if (!searchEnabled) {
      const id = extractVideoId(q)
      if (id) {
        setVideoId(id)
        setError(null)
      } else {
        setError(t("music.invalidLink"))
      }
      return
    }

    setLoading(true)
    setError(null)
    try {
      const items = await youtubeSearch(q)
      setResults(items)
      if (items.length === 0) setError(t("music.noResults"))
    } catch {
      setError(t("music.searchError"))
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setVideoId(null)
    setResults([])
    setQuery("")
    setError(null)
  }

  return (
    <div className="glass-tile music-widget widget-span-2 overflow-hidden p-0">
      <div className="music-widget-header flex items-center justify-between gap-2 px-5 pb-3 pt-5">
        <div className="dashboard-widget-title">
          <Youtube className="h-4 w-4 text-red-500" />
          <span>{t("music.title")}</span>
        </div>
        {(videoId || results.length > 0) && (
          <button
            type="button"
            onClick={reset}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted"
            aria-label={t("music.close")}
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {!videoId && (
        <div className="music-search-row flex gap-2 px-5 pb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleSearch()}
            placeholder={searchEnabled ? t("music.searchPlaceholder") : t("music.paste")}
            className="dashboard-control music-search-input min-w-0 flex-1 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/55 focus-visible:ring-2 focus-visible:ring-ring/35"
          />
          <button
            type="button"
            onClick={() => void handleSearch()}
            disabled={loading || !query.trim()}
            className="music-search-button flex shrink-0 items-center gap-1.5 rounded-xl bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition-[background-color,opacity,transform] hover:bg-red-500 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {searchEnabled ? t("music.search") : t("music.play")}
          </button>
        </div>
      )}

      {error && <p className="px-5 pb-2 text-xs text-muted-foreground">{error}</p>}

      {videoId ? (
        <div className="music-player overflow-hidden border-t border-border/50 bg-black/90">
          <div className="relative h-full min-h-0 w-full">
            <iframe
              title="YouTube"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      ) : results.length > 0 ? (
        <ul className="music-results custom-scrollbar space-y-1.5 overflow-y-auto px-5 pb-5 pr-3">
          {results.map((video) => (
            <li key={video.id}>
              <button
                type="button"
                onClick={() => setVideoId(video.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-transparent p-1.5 text-left transition-colors hover:border-border/60 hover:bg-foreground/5 focus-visible:border-ring focus-visible:outline-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt=""
                  loading="lazy"
                  className="aspect-video h-12 w-[4.25rem] shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{video.title}</p>
                  {video.channel && (
                    <p className="truncate text-xs text-muted-foreground">{video.channel}</p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="dashboard-control music-empty mx-5 mb-5 flex items-center justify-center px-4 text-center text-xs text-muted-foreground">
          {searchEnabled ? t("music.searchHint") : t("music.empty")}
        </div>
      )}
    </div>
  )
}
