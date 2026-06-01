import type { LandingLang } from "@/lib/landing-content"
import { landingContent } from "@/lib/landing-content"
import { AUTHOR_NAME, AUTHOR_SITE, GITHUB_ISSUES_NEW, LICENSE_URL } from "@/lib/site"

export function LandingFooter({ lang }: { lang: LandingLang }) {
  const copy = landingContent[lang]

  return (
    <footer className="relative z-10 border-t border-[var(--landing-border)] px-4 py-[var(--landing-space-2xl)] sm:px-6">
      <div className="landing-body mx-auto max-w-2xl space-y-3 text-center">
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
            href={LICENSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--landing-text-muted)] hover:text-[var(--landing-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-accent)]"
          >
            MIT · Open source
          </a>
        </p>
      </div>
    </footer>
  )
}
