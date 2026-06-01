import Link from "next/link"
import { Briefcase, Github, Linkedin } from "lucide-react"
import { BrandMark } from "@/components/landing/brand-mark"
import type { LandingLang } from "@/lib/landing-content"
import { APP_NAME, AUTHOR_GITHUB, AUTHOR_LINKEDIN, AUTHOR_SITE } from "@/lib/site"

const social = [
  {
    href: AUTHOR_GITHUB,
    label: "GitHub",
    icon: Github,
  },
  {
    href: AUTHOR_LINKEDIN,
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: AUTHOR_SITE,
    label: "Portfolio",
    icon: Briefcase,
  },
] as const

export function LandingHeader({ lang }: { lang: LandingLang }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0c0c10]/85 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0c0c10]/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link
          href={lang === "es" ? "/" : "/en"}
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white/90 hover:text-white shrink-0"
        >
          <BrandMark size={26} />
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav
            className="flex items-center rounded-lg border border-white/10 p-0.5"
            aria-label="Language"
          >
            <Link
              href="/"
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                lang === "es" ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"
              }`}
              aria-current={lang === "es" ? "page" : undefined}
            >
              ES
            </Link>
            <Link
              href="/en"
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                lang === "en" ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"
              }`}
              aria-current={lang === "en" ? "page" : undefined}
            >
              EN
            </Link>
          </nav>

          <span className="hidden sm:block w-px h-5 bg-white/10 mx-1" />

          <div className="flex items-center gap-0.5">
            {social.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-lg text-white/45 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Icon className="w-4 h-4" strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
