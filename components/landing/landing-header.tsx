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
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[var(--landing-bg)]/95">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={lang === "es" ? "/" : "/en"}
          className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-white/90 hover:text-white"
        >
          <BrandMark size={26} />
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="#faq"
            className="hidden rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white sm:inline"
          >
            {faqLabel}
          </a>

          <nav
            className="flex items-center rounded-lg border border-white/10 p-0.5"
            aria-label="Language"
          >
            <Link
              href="/"
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                lang === "es" ? "bg-white/15 text-white" : "text-white/55 hover:text-white/85"
              }`}
              aria-current={lang === "es" ? "page" : undefined}
            >
              ES
            </Link>
            <Link
              href="/en"
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                lang === "en" ? "bg-white/15 text-white" : "text-white/55 hover:text-white/85"
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
                className="rounded-lg p-2 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
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
