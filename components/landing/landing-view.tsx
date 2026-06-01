import Image from "next/image"
import { getChangelog, getLatestVersion } from "@/lib/changelog"
import { LandingChangelog } from "@/components/landing/landing-changelog"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { landingContent, type LandingLang } from "@/lib/landing-content"
import {
  APP_NAME,
  SITE_URL,
  AUTHOR_SITE,
  GITHUB_RELEASES,
  WINDOWS_INSTALLER_NAME,
  WINDOWS_INSTALLER_URL,
  APP_VERSION,
} from "@/lib/site"

const galleryShots = (copy: (typeof landingContent)[LandingLang]) => [
  {
    src: "/screenshots/portrait-dark.png",
    alt: copy.screenshotAlts.portraitDark,
    label: copy.screenshotLabels.portraitDark,
    className: "max-w-[280px] mx-auto",
  },
  {
    src: "/screenshots/portrait-light.png",
    alt: copy.screenshotAlts.portraitLight,
    label: copy.screenshotLabels.portraitLight,
    className: "max-w-[280px] mx-auto",
  },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 text-center text-xl font-semibold tracking-tight text-white/90 sm:text-2xl">
      {children}
    </h2>
  )
}

function SectionLead({ children }: { children: React.ReactNode }) {
  return <p className="mb-8 text-center text-sm leading-relaxed text-white/65">{children}</p>
}

export function LandingView({ lang }: { lang: LandingLang }) {
  const copy = landingContent[lang]
  const changelog = getChangelog(lang)
  const latestChangelog = changelog[0]
  const version = getLatestVersion(APP_VERSION, lang)
  const shots = galleryShots(copy)

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: APP_NAME,
    operatingSystem: "Windows",
    applicationCategory: "UtilitiesApplication",
    softwareVersion: version,
    description: copy.metaDescription,
    url: SITE_URL,
    downloadUrl: WINDOWS_INSTALLER_URL,
    license: "https://opensource.org/licenses/MIT",
    inLanguage: copy.htmlLang,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Person", name: "Moises Valero", url: AUTHOR_SITE },
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: copy.htmlLang,
    mainEntity: copy.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  return (
    <div lang={copy.htmlLang} className="landing-page min-h-screen text-[#f5f5f7] antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div
        className="pointer-events-none fixed left-1/2 top-0 h-[420px] w-[min(100%,720px)] -translate-x-1/2 rounded-full opacity-80"
        style={{ background: "var(--landing-glow)" }}
        aria-hidden
      />

      <LandingHeader lang={lang} faqLabel={copy.navFaq} />

      <header className="relative z-10 mx-auto max-w-4xl px-6 pb-8 pt-12 text-center">
        <p className="mb-5 text-sm font-medium text-[var(--landing-accent)]">{copy.eyebrow}</p>
        <h1
          className="landing-display mb-5 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          {copy.heroTitle[0]}
          <br />
          <span className="text-white/95">{copy.heroTitle[1]}</span>
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/70">
          {copy.heroSubtitle}
        </p>
        <div className="flex flex-col items-center gap-3">
          <a
            href={WINDOWS_INSTALLER_URL}
            download={WINDOWS_INSTALLER_NAME}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--landing-accent)] px-8 py-3.5 text-sm font-semibold text-[var(--landing-accent-fg)] transition-opacity hover:opacity-90"
          >
            {copy.ctaDownload}
          </a>
          <a
            href={GITHUB_RELEASES}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/60 underline-offset-2 transition-colors hover:text-white/85 hover:underline"
          >
            {copy.ctaGithub}
          </a>
        </div>
        <p className="mt-4 text-xs text-white/50">
          v{version} · {copy.heroNote}
        </p>

        <div className="mx-auto mt-14 w-full max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-white/12 ring-1 ring-white/5">
            <Image
              src="/screenshots/landscape-dark.png"
              alt={copy.screenshotAlts.landscapeDark}
              width={1120}
              height={780}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        <SectionTitle>{copy.screenshotsTitle}</SectionTitle>
        <SectionLead>{copy.screenshotsSubtitle}</SectionLead>
        <div className="grid gap-6 sm:grid-cols-2">
          {shots.map((shot) => (
            <figure key={shot.src} className={shot.className}>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={480}
                  height={980}
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-center text-xs text-white/55">{shot.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-3xl px-6 py-12">
        <SectionTitle>{copy.featuresTitle}</SectionTitle>
        <div className="mt-6">
          <LandingFeatures groups={copy.featureGroups} />
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-2xl px-6 py-12">
        <SectionTitle>{copy.installTitle}</SectionTitle>
        <ol className="mt-6 list-inside list-decimal space-y-4 text-sm leading-relaxed text-white/70">
          {copy.install.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <LandingChangelog
        latest={latestChangelog}
        copy={{
          changelogTitle: copy.changelogTitle,
          changelogSubtitle: copy.changelogSubtitle,
          changelogLink: copy.changelogLink,
          changelogEmpty: copy.changelogEmpty,
        }}
      />

      <section id="faq" className="relative z-10 mx-auto max-w-2xl scroll-mt-20 px-6 py-12">
        <SectionTitle>{copy.faqTitle}</SectionTitle>
        <div className="mt-8 space-y-4">
          {copy.faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3"
            >
              <summary className="cursor-pointer list-none font-medium text-white/92 [&::-webkit-details-marker]:hidden">
                {item.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{item.a}</p>
              {item.steps && (
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-white/65 marker:text-white/45">
                  {item.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              )}
              {item.note && (
                <p className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-100/90">
                  {item.note}
                </p>
              )}
            </details>
          ))}
        </div>
      </section>

      <LandingFooter lang={lang} />
    </div>
  )
}
