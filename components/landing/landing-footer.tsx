import type { LandingLang } from "@/lib/landing-content"
import { landingContent } from "@/lib/landing-content"
import { AUTHOR_NAME, AUTHOR_SITE, GITHUB_REPO } from "@/lib/site"

export function LandingFooter({ lang }: { lang: LandingLang }) {
  const copy = landingContent[lang]

  return (
    <footer className="relative z-10 border-t border-white/[0.06] py-10 px-6">
      <div className="max-w-2xl mx-auto text-center space-y-3 text-sm text-white/45">
        <p>
          {copy.footerDeveloped}{" "}
          <a
            href={AUTHOR_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white font-medium"
          >
            {AUTHOR_NAME}
          </a>
        </p>
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <a href={GITHUB_REPO} className="text-blue-400/90 hover:text-blue-300 hover:underline">
            {copy.footerSource}
          </a>
          <span className="text-white/20" aria-hidden>
            ·
          </span>
          <span>MIT</span>
        </p>
      </div>
    </footer>
  )
}
