import Image from "next/image"
import { getChangelog, getLatestVersion } from "@/lib/changelog"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { landingContent, type LandingLang } from "@/lib/landing-content"
import { SITE_URL, AUTHOR_SITE, GITHUB_REPO, GITHUB_RELEASES, APP_VERSION } from "@/lib/site"

const screenshots = (copy: (typeof landingContent)[LandingLang]) => [
  {
    src: "/screenshots/portrait-dark.png",
    alt:
      copy.htmlLang === "es"
        ? "Desk Dashboard en monitor vertical, modo oscuro"
        : "Desk Dashboard on a portrait monitor, dark mode",
    label: copy.screenshotLabels.portraitDark,
    className: "max-w-[280px] mx-auto",
  },
  {
    src: "/screenshots/portrait-light.png",
    alt:
      copy.htmlLang === "es"
        ? "Desk Dashboard en monitor vertical, modo claro"
        : "Desk Dashboard on a portrait monitor, light mode",
    label: copy.screenshotLabels.portraitLight,
    className: "max-w-[280px] mx-auto",
  },
  {
    src: "/screenshots/landscape-dark.png",
    alt:
      copy.htmlLang === "es"
        ? "Desk Dashboard en monitor horizontal, modo oscuro"
        : "Desk Dashboard on a landscape monitor, dark mode",
    label: copy.screenshotLabels.landscapeDark,
    className: "sm:col-span-2 max-w-3xl mx-auto w-full",
  },
]

export function LandingView({ lang }: { lang: LandingLang }) {
  const copy = landingContent[lang]
  const changelog = getChangelog()
  const version = getLatestVersion(APP_VERSION)
  const shots = screenshots(copy)

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Desk Dashboard",
    operatingSystem: "Windows",
    applicationCategory: "UtilitiesApplication",
    softwareVersion: version,
    description: copy.metaDescription,
    url: SITE_URL,
    downloadUrl: GITHUB_RELEASES,
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
        <div className="flex justify-center">
          <a
            href={GITHUB_RELEASES}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-medium text-sm hover:bg-white/90 transition-transform hover:scale-[1.02]"
          >
            {copy.ctaDownload}
          </a>
        </div>
        <p className="text-white/30 text-xs mt-4">
          v{version} · {copy.heroNote}
        </p>

        <div className="mt-14 mx-auto max-w-[300px]">
          <div className="rounded-[28px] overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/5">
            <Image
              src="/screenshots/hero.png"
              alt={
                copy.htmlLang === "es" ? "Vista previa de Desk Dashboard" : "Desk Dashboard preview"
              }
              width={480}
              height={820}
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

      <section className="relative z-10 max-w-2xl mx-auto px-6 py-12 pb-20">
        <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-8 text-center">
          {copy.changelogTitle}
        </h2>
        <div className="space-y-6">
          {changelog.map((entry) => (
            <div key={entry.version} className="border-l-2 border-blue-500/50 pl-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-semibold text-white">v{entry.version}</span>
                <span className="text-xs text-white/35">{entry.date}</span>
              </div>
              {entry.groups.map((group, gi) => (
                <div key={`${entry.version}-${gi}`} className="mb-2">
                  {group.category && (
                    <p className="text-[11px] font-medium uppercase tracking-wider text-blue-400/70 mb-1">
                      {group.category}
                    </p>
                  )}
                  <ul className="text-sm text-white/55 space-y-1 list-disc list-inside">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-sm">
          <a
            href={`${GITHUB_REPO}/blob/main/CHANGELOG.md`}
            className="text-blue-400 hover:text-blue-300"
          >
            {copy.changelogLink}
          </a>
        </p>
      </section>

      <LandingFooter lang={lang} />
    </div>
  )
}
