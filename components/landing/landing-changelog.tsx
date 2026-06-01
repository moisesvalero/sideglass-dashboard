import type { ChangelogEntry } from "@/lib/changelog"
import { GITHUB_RELEASES } from "@/lib/site"

type Copy = {
  changelogTitle: string
  changelogLink: string
  changelogEmpty: string
}

export function LandingChangelog({
  entries,
  copy,
}: {
  entries: ChangelogEntry[]
  copy: Copy
}) {
  return (
    <section
      id="changelog"
      className="relative z-10 mx-auto max-w-2xl scroll-mt-20 px-6 py-12 pb-8"
    >
      <h2 className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-white/40">
        {copy.changelogTitle}
      </h2>

      {entries.length === 0 ? (
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-200/80">
          {copy.changelogEmpty}
        </p>
      ) : (
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <details
            key={entry.version}
            open={index === 0}
            className="group rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-1 open:bg-white/[0.03]"
          >
            <summary className="flex cursor-pointer list-none items-baseline justify-between gap-3 py-3 font-medium text-white/90 [&::-webkit-details-marker]:hidden">
              <span>v{entry.version}</span>
              <span className="text-xs font-normal text-white/35">{entry.date}</span>
            </summary>
            <div className="space-y-4 border-t border-white/[0.06] pb-4 pt-3">
              {entry.groups.map((group, gi) => (
                <div key={`${entry.version}-${gi}`}>
                  {group.category ? (
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-blue-400/70">
                      {group.category}
                    </p>
                  ) : null}
                  <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-white/55">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
      )}

      <p className="mt-6 text-center text-sm">
        <a
          href={GITHUB_RELEASES}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300"
        >
          {copy.changelogLink}
        </a>
      </p>
    </section>
  )
}
