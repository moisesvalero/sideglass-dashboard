"use client"

type LandingHeroMediaProps = {
  alt: string
  playLabel: string
}

export function LandingHeroMedia({ alt, playLabel }: LandingHeroMediaProps) {
  return (
    <div className="landing-shot-frame landing-hero-media" aria-label={alt}>
      <video
        className="h-auto w-full"
        src="/media/sideglass-dashboard-demo.webm"
        poster="/screenshots/landscape-dark.png"
        aria-label={playLabel}
        controls
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  )
}
