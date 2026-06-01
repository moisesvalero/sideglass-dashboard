import Link from "next/link"
import { Briefcase, Github, Linkedin } from "lucide-react"
import { BrandMark } from "@/components/landing/brand-mark"
import type { LandingLang } from "@/lib/landing-content"
import { APP_NAME, AUTHOR_GITHUB, AUTHOR_LINKEDIN, AUTHOR_SITE } from "@/lib/site"

const social = [
  { href: AUTHOR_GITHUB, label: "GitHub", icon: Github },
  { href: AUTHOR_LINKEDIN, label: "LinkedIn", icon: Linkedin },
  { href: AUTHOR_SITE, label: "Portfolio", icon: Briefcase },
] as const

export function LandingHeader({ lang, faqLabel }: { lang: LandingLang; faqLabel: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--landing-border)] bg-[color-mix(in_oklch,var(--landing-bg)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={lang === "es" ? "/" : "/en"}
          className="flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-[var(--landing-text)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-accent)]"
        >
          <BrandMark size={26} />
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="#download"
            className="landing-body hidden min-h-11 items-center rounded-lg px-3 py-2 font-medium text-[var(--landing-accent-soft)] transition-colors hover:bg-[oklch(0.72_0.1_215/0.12)] sm:inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-accent)]"
          >
            {lang === "es" ? "Descargar" : "Download"}
          </a>
          <a
            href="#faq"
            className="landing-body hidden min-h-11 items-center rounded-lg px-3 py-2 font-medium transition-colors hover:bg-[oklch(0.72_0.1_215/0.12)] hover:text-[var(--landing-text)] md:inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-accent)]"
          >
            {faqLabel}
          </a>

          <nav
            className="flex items-center rounded-lg border border-white/10 p-0.5"
            aria-label="Language"
          >
            <Link
              href="/"
              className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-accent)] ${
                lang === "es" ? "bg-white/15 text-[var(--landing-text)]" : "text-[var(--landing-text-muted)] hover:text-[var(--landing-text)]"
              }`}
              aria-current={lang === "es" ? "page" : undefined}
            >
              ES
            </Link>
            <Link
              href="/en"
              className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-accent)] ${
                lang === "en" ? "bg-white/15 text-[var(--landing-text)]" : "text-[var(--landing-text-muted)] hover:text-[var(--landing-text)]"
              }`}
              aria-current={lang === "en" ? "page" : undefined}
            >
              EN
            </Link>
          </nav>

          <span className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />

          <div className="flex items-center gap-0.5">
            {social.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[var(--landing-text-muted)] transition-colors hover:bg-white/10 hover:text-[var(--landing-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-accent)]"
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
