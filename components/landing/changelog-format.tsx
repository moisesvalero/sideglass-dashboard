import type { ChangelogEntry } from "@/lib/changelog"

const MAX_ITEMS = 5

/** Renders `**bold**` from CHANGELOG markdown as <strong>. */
export function formatChangelogText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-[var(--landing-accent-soft)]">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

export function pickLatestHighlights(entry: ChangelogEntry | undefined): string[] {
  if (!entry) return []
  const items: string[] = []
  for (const group of entry.groups) {
    for (const item of group.items) {
      items.push(item)
      if (items.length >= MAX_ITEMS) return items
    }
  }
  return items
}
