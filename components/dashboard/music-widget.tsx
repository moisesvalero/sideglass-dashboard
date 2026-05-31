"use client"

import { useState } from "react"
import { Youtube, X, Search, Link } from "lucide-react"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [videoId, setVideoId] = useState<string | null>(null)
  const [showSearch, setShowSearch] = useState(false)
  const { t } = useI18n()

  const handleSearch = () => {
    const q = searchQuery.trim()
    if (!q) return
    setVideoId(null)
    setShowSearch(true)
  }

  const handlePasteLink = (url: string) => {
    const id = extractVideoId(url.trim())
    if (id) {
      setVideoId(id)
      setShowSearch(false)
      setSearchQuery("")
    }
  }

  const handleClose = () => {
    setVideoId(null)
    setShowSearch(false)
    setSearchQuery("")
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Youtube className="w-4 h-4 text-red-400" />
          <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">
            {t("music.title")}
          </h2>
        </div>
        {(videoId || showSearch) && (
          <button
            onClick={handleClose}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white/60" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10 mb-3">
        <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const id = extractVideoId(searchQuery.trim())
              if (id) handlePasteLink(searchQuery.trim())
              else handleSearch()
            }
          }}
          placeholder={t("music.search")}
          className="flex-1 bg-transparent text-white/80 text-sm outline-none placeholder:text-white/30 min-w-0"
        />
        {searchQuery && (
          <button
            onClick={() => {
              const id = extractVideoId(searchQuery.trim())
              if (id) handlePasteLink(searchQuery.trim())
              else handleSearch()
            }}
            className="px-3 py-1 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-xs font-medium transition-colors flex-shrink-0"
          >
            {t("music.go")}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Link className="w-3 h-3 text-white/30 flex-shrink-0" />
        <input
          type="text"
          placeholder={t("music.paste")}
          onChange={(e) => {
            const id = extractVideoId(e.target.value)
            if (id) handlePasteLink(e.target.value)
          }}
          className="flex-1 bg-transparent text-white/50 text-xs outline-none placeholder:text-white/20"
        />
      </div>

      {videoId && (
        <div className="rounded-xl overflow-hidden bg-black/60 mt-2">
          <div className="relative" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-xl"
            />
          </div>
        </div>
      )}

      {showSearch && !videoId && searchQuery && (
        <div className="rounded-xl overflow-hidden bg-black/60 mt-2">
          <div className="relative" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(searchQuery)}&modestbranding=1&rel=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}
