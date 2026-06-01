"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

type LandingHeroMediaProps = {
  alt: string
  playLabel: string
}

export function LandingHeroMedia({ alt, playLabel }: LandingHeroMediaProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (isPlaying) {
    return (
      <div className="landing-shot-frame landing-hero-media">
        <video
          className="h-auto w-full"
          src="/media/sideglass-dashboard-demo.webm"
          poster="/screenshots/landscape-dark.png"
          controls
          autoPlay
          muted
          playsInline
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className="landing-shot-frame landing-hero-media landing-hero-media-button group"
      onClick={() => setIsPlaying(true)}
      aria-label={playLabel}
    >
      <Image
        src="/screenshots/landscape-dark.png"
        alt={alt}
        width={1280}
        height={820}
        className="h-auto w-full"
        priority
      />
      <span className="landing-video-play" aria-hidden>
        <Play className="h-5 w-5 fill-current" />
      </span>
    </button>
  )
}
