import Image from "next/image"
import { getChangelog, getChangelogSourcePath, getLatestVersion } from "@/lib/changelog"
import { LandingChangelog } from "@/components/landing/landing-changelog"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { landingContent, type LandingLang } from "@/lib/landing-content"
import {
  APP_NAME,
  SITE_URL,
  AUTHOR_SITE,
  GITHUB_REPO,
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

export function LandingView({ lang }: { lang: LandingLang }) {
  const copy = landingContent[lang]
  const changelog = getChangelog(lang)
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
    <div
      lang={copy.htmlLang}
      className="min-h-screen bg-[#0c0c10] text-[#f5f5f7] font-sans antialiased"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-blue-600/12 rounded-full blur-[140px] pointer-events-none" />

      <LandingHeader lang={lang} />

      <header className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-blue-400/80 uppercase mb-6">
          {copy.eyebrow}
        </p>
        <h1
          className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight mb-5"
          style={{ letterSpacing: "-0.03em" }}
        >
          {copy.heroTitle[0]}
          <br />
          {copy.heroTitle[1]}
        </h1>
        <p className="text-lg text-white/55 max-w-xl mx-auto mb-10 leading-relaxed">
          {copy.heroSubtitle}
        </p>
        <div className="flex flex-col items-center gap-3">
          <a
            href={WINDOWS_INSTALLER_URL}
            download={WINDOWS_INSTALLER_NAME}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-medium text-sm hover:bg-white/90 transition-transform hover:scale-[1.02]"
          >
            {copy.ctaDownload}
          </a>
          <a
            href={GITHUB_RELEASES}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/45 underline-offset-2 hover:text-white/70 hover:underline"
          >
            {copy.ctaReleaseNotes}
          </a>
        </div>
        <p className="text-white/30 text-xs mt-4">
          v{version} · {copy.heroNote}
        </p>

        <div className="mt-14 mx-auto max-w-5xl w-full">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/5">
            <Image
              src="/screenshots/landscape-dark.png"
              alt={copy.screenshotAlts.landscapeDark}
              width={1120}
              height={780}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </header>

      <section className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-6 text-center">
          {copy.screenshotsTitle}
        </h2>
        <p className="text-center text-white/40 text-sm mb-10 max-w-lg mx-auto">
          {copy.screenshotsSubtitle}
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {shots.map((shot) => (
            <figure key={shot.src} className={shot.className}>
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-xl">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.src.includes("landscape") ? 1120 : 480}
                  height={shot.src.includes("landscape") ? 780 : 980}
                  className="w-full h-auto"
                />
              </div>
              <figcaption className="text-center text-xs text-white/40 mt-3">
                {shot.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-8 text-center">
          {copy.featuresTitle}
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {copy.features.map((f) => (
            <div
              key={f.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
            >
              <h3 className="font-medium text-white/95 mb-1">{f.label}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-8 text-center">
          {copy.installTitle}
        </h2>
        <ol className="space-y-4 text-sm text-white/70 list-decimal list-inside">
          {copy.install.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-8 text-center">
          {copy.faqTitle}
        </h2>
        <div className="space-y-4">
          {copy.faq.map((item) => (
            <details
              key={item.q}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 group"
            >
              <summary className="cursor-pointer font-medium text-white/90 list-none">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-white/50 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <LandingChangelog
        entries={changelog}
        copy={{
          changelogTitle: copy.changelogTitle,
          changelogHint: copy.changelogHint,
          changelogLink: copy.changelogLink,
        }}
        sourceFile={getChangelogSourcePath(lang)}
      />

      <LandingFooter lang={lang} />
    </div>
  )
}
