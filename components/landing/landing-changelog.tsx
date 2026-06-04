import type { ChangelogEntry } from "@/lib/changelog"
import type { LandingLang } from "@/lib/landing-content"
import { GITHUB_RELEASES } from "@/lib/site"
import { formatChangelogText, pickLatestHighlights } from "@/components/landing/changelog-format"

type Copy = {
  changelogTitle: string
  changelogSubtitle: string
  changelogLink: string
  changelogEmpty: string
}

export function LandingChangelog({
  latest,
  copy,
  lang,
}: {
  latest: ChangelogEntry | undefined
  copy: Copy
  lang: LandingLang
}) {
  const highlights = pickLatestHighlights(latest, lang)

  return (
    <section
      id="changelog"
      className="landing-section relative z-10 mx-auto max-w-2xl scroll-mt-24 px-4 sm:px-6"
    >
      <h2 className="landing-section-title">{copy.changelogTitle}</h2>
      <p className="landing-section-lead">{copy.changelogSubtitle}</p>

      {!latest || highlights.length === 0 ? (
        <p className="landing-body rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-center text-amber-100">
          {copy.changelogEmpty}
        </p>
      ) : (
        <div className="landing-card">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="font-medium text-[var(--landing-text)]">v{latest.version}</span>
            <time className="landing-caption" dateTime={latest.date}>
              {latest.date}
            </time>
          </div>
          <ul className="landing-body list-inside list-disc space-y-2">
            {highlights.map((item) => (
              <li key={item}>{formatChangelogText(item)}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-[var(--landing-space-lg)] text-center">
        <a
          href={GITHUB_RELEASES}
          target="_blank"
          rel="noopener noreferrer"
          className="landing-body text-[var(--landing-accent)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-accent)]"
        >
          {copy.changelogLink}
        </a>
      </p>
    </section>
  )
}
