import { readFileSync } from "node:fs"
import { join } from "node:path"

export type ChangelogGroup = {
  category: string
  items: string[]
}

export type ChangelogEntry = {
  version: string
  date: string
  groups: ChangelogGroup[]
}

/**
 * Single source of truth for the changelog: parses the root CHANGELOG.md at
 * build time. Add a new "## [x.y.z] - YYYY-MM-DD" section and the website
 * updates automatically on the next build/deploy.
 */
export function getChangelog(): ChangelogEntry[] {
  let raw: string
  try {
    raw = readFileSync(join(process.cwd(), "CHANGELOG.md"), "utf8")
  } catch {
    return []
  }

  const entries: ChangelogEntry[] = []
  let current: ChangelogEntry | null = null
  let group: ChangelogGroup | null = null

  for (const line of raw.split("\n")) {
    const versionMatch = line.match(/^##\s+\[([^\]]+)\]\s*-\s*(.+?)\s*$/)
    if (versionMatch) {
      current = { version: versionMatch[1], date: versionMatch[2], groups: [] }
      group = null
      entries.push(current)
      continue
    }

    const groupMatch = line.match(/^###\s+(.+?)\s*$/)
    if (groupMatch && current) {
      group = { category: groupMatch[1], items: [] }
      current.groups.push(group)
      continue
    }

    const itemMatch = line.match(/^[-*]\s+(.+?)\s*$/)
    if (itemMatch && current) {
      if (!group) {
        group = { category: "", items: [] }
        current.groups.push(group)
      }
      group.items.push(itemMatch[1])
    }
  }

  return entries
}

export function getLatestVersion(fallback: string): string {
  return getChangelog()[0]?.version ?? fallback
}
