import type { ChangelogEntry } from "@/lib/changelog"
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
}: {
  latest: ChangelogEntry | undefined
  copy: Copy
}) {
  const highlights = pickLatestHighlights(latest)

  return (
    <section
      id="changelog"
      className="relative z-10 mx-auto max-w-2xl scroll-mt-20 px-6 py-12 pb-8"
    >
      <h2 className="mb-2 text-center text-xl font-semibold tracking-tight text-white/90 sm:text-2xl">
        {copy.changelogTitle}
      </h2>
      <p className="mb-8 text-center text-sm text-white/65">{copy.changelogSubtitle}</p>

      {!latest || highlights.length === 0 ? (
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-200/90">
          {copy.changelogEmpty}
        </p>
      ) : (
        <div className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-5 py-4">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="font-medium text-white/90">v{latest.version}</span>
            <span className="text-xs text-white/50">{latest.date}</span>
          </div>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-white/70">
            {highlights.map((item) => (
              <li key={item}>{formatChangelogText(item)}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-center text-sm">
        <a
          href={GITHUB_RELEASES}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--landing-accent)] hover:underline underline-offset-2"
        >
          {copy.changelogLink}
        </a>
      </p>
    </section>
  )
}
