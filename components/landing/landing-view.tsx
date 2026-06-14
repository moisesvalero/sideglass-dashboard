import Image from "next/image"
import { getChangelog, getLatestVersion } from "@/lib/changelog"
import { LandingChangelog } from "@/components/landing/landing-changelog"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingHeroMedia } from "@/components/landing/landing-hero-media"
import { landingContent, type LandingLang } from "@/lib/landing-content"
import {
  APP_NAME,
  SITE_URL,
  AUTHOR_SITE,
  GITHUB_RELEASES,
  WINDOWS_INSTALLER_NAME,
  WINDOWS_INSTALLER_URL,
  APP_VERSION,
  LICENSE_URL,
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
    license: LICENSE_URL,
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
    <div lang={copy.htmlLang} className="landing-page min-h-screen antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="landing-ambient" aria-hidden>
        <div className="landing-ambient-cyan" />
        <div className="landing-ambient-violet" />
      </div>

      <LandingHeader lang={lang} faqLabel={copy.navFaq} />

      <header className="relative z-10 mx-auto max-w-4xl px-4 pb-[var(--landing-space-xl)] pt-[var(--landing-space-hero-top)] text-center sm:px-6">
        <p className="landing-display landing-eyebrow landing-reveal mb-[var(--landing-space-lg)]">
          {copy.eyebrow}
        </p>
        <h1 className="landing-display landing-hero-title landing-reveal landing-reveal-d1 mb-[var(--landing-space-lg)]">
          {copy.heroTitle[0]}
          <br />
          <span className="text-[var(--landing-text)]">{copy.heroTitle[1]}</span>
        </h1>
        <p className="landing-hero-lead landing-reveal landing-reveal-d2 mb-[var(--landing-space-xl)]">
          {copy.heroSubtitle}
        </p>
        <div
          id="download"
          className="landing-reveal landing-reveal-d3 flex scroll-mt-28 flex-col items-stretch gap-3 sm:items-center"
        >
          <a
            href={WINDOWS_INSTALLER_URL}
            download={WINDOWS_INSTALLER_NAME}
            className="landing-cta-primary inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--landing-accent)] text-[var(--landing-accent-fg)]"
          >
            {copy.ctaDownload}
          </a>
          <a
            href={GITHUB_RELEASES}
            target="_blank"
            rel="noopener noreferrer"
            className="landing-cta-secondary inline-flex items-center justify-center underline-offset-2 hover:underline"
          >
            {copy.ctaGithub}
          </a>
          <p className="landing-winget-hint">
            {copy.ctaWinget}
            <code>winget install Sideglass</code>
          </p>
        </div>
        <p className="landing-caption landing-reveal landing-reveal-d4 mt-[var(--landing-space-md)]">
          v{version} · {copy.heroNote}
        </p>

        <div className="landing-reveal landing-reveal-d5 mx-auto mt-[var(--landing-space-2xl)] w-full max-w-5xl">
          <LandingHeroMedia
            alt={copy.screenshotAlts.landscapeDark}
            playLabel={copy.heroVideoPlayLabel}
          />
        </div>
      </header>

      <section className="landing-section relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="landing-section-title">{copy.screenshotsTitle}</h2>
        <p className="landing-section-lead">{copy.screenshotsSubtitle}</p>
        <div className="grid gap-[var(--landing-space-lg)] sm:grid-cols-2">
          {shots.map((shot) => (
            <figure key={shot.src} className={shot.className}>
              <div className="landing-shot-frame">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={480}
                  height={980}
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="landing-caption mt-3 text-center">{shot.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="landing-section relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="landing-section-title">{copy.featuresTitle}</h2>
        <div className="mt-[var(--landing-space-lg)]">
          <LandingFeatures groups={copy.featureGroups} />
        </div>
      </section>

      <section className="landing-section relative z-10 mx-auto max-w-2xl px-4 sm:px-6">
        <h2 className="landing-section-title">{copy.installTitle}</h2>
        <ol className="landing-body mt-[var(--landing-space-lg)] list-inside list-decimal space-y-4">
          {copy.install.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <LandingChangelog
        latest={latestChangelog}
        lang={lang}
        copy={{
          changelogTitle: copy.changelogTitle,
          changelogSubtitle: copy.changelogSubtitle,
          changelogLink: copy.changelogLink,
          changelogEmpty: copy.changelogEmpty,
        }}
      />

      <section
        id="faq"
        className="landing-section relative z-10 mx-auto max-w-2xl scroll-mt-24 px-4 sm:px-6"
      >
        <h2 className="landing-section-title">{copy.faqTitle}</h2>
        <div className="mt-[var(--landing-space-xl)] space-y-4">
          {copy.faq.map((item) => (
            <details key={item.q} className="landing-faq group">
              <summary className="cursor-pointer list-none font-medium text-[var(--landing-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-accent)] [&::-webkit-details-marker]:hidden">
                {item.q}
              </summary>
              <p className="landing-body mt-2">{item.a}</p>
              {item.steps && (
                <ol className="landing-body mt-3 list-decimal space-y-2 pl-5 marker:text-[var(--landing-text-subtle)]">
                  {item.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              )}
              {item.note && (
                <p className="landing-body mt-3 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-amber-100">
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
