import { Heart } from "lucide-react"
import type { LandingLang } from "@/lib/landing-content"
import { landingContent } from "@/lib/landing-content"
import { AUTHOR_NAME, AUTHOR_SITE, GITHUB_ISSUES_NEW, PAYPAL_DONATE_URL } from "@/lib/site"

export function LandingFooter({ lang }: { lang: LandingLang }) {
  const copy = landingContent[lang]

  return (
    <footer className="relative z-10 border-t border-[var(--landing-border)] px-4 py-[var(--landing-space-2xl)] sm:px-6">
      <div className="landing-body mx-auto max-w-2xl space-y-3 text-center">
        <p>
          <a
            href={GITHUB_ISSUES_NEW}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--landing-accent)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-accent)]"
          >
            {copy.footerReportIssue}
          </a>
        </p>
        <p>
          <a
            href={PAYPAL_DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-[var(--landing-text-muted)] transition-colors hover:text-[var(--landing-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-accent)]"
          >
            <Heart
              className="h-3.5 w-3.5 fill-rose-400/80 text-rose-400/80"
              strokeWidth={1.75}
              aria-hidden
            />
            {copy.footerSupport}
          </a>
        </p>
        <p>
          {copy.footerDeveloped}{" "}
          <a
            href={AUTHOR_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--landing-text)] hover:underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-accent)]"
          >
            {AUTHOR_NAME}
          </a>
        </p>
      </div>
    </footer>
  )
}
