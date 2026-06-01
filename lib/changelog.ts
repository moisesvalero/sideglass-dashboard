import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { LandingLang } from "@/lib/landing-content"
import generated from "./changelog.generated.json"

export type ChangelogGroup = {
  category: string
  items: string[]
}

export type ChangelogEntry = {
  version: string
  date: string
  groups: ChangelogGroup[]
}

const CHANGELOG_EN = join(process.cwd(), "CHANGELOG.md")
const CHANGELOG_ES = join(process.cwd(), "CHANGELOG.es.md")

function parseChangelog(raw: string): ChangelogEntry[] {
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

function readFromMarkdown(lang: LandingLang): ChangelogEntry[] {
  try {
    const path = lang === "es" ? CHANGELOG_ES : CHANGELOG_EN
    return parseChangelog(readFileSync(path, "utf8"))
  } catch {
    try {
      return parseChangelog(readFileSync(CHANGELOG_EN, "utf8"))
    } catch {
      return []
    }
  }
}

/**
 * Changelog for the landing: baked JSON from `npm run sync:changelog` (runs before build).
 * Edit CHANGELOG.md / CHANGELOG.es.md, then build or run `npm run sync:changelog`.
 */
export function getChangelog(lang: LandingLang = "en"): ChangelogEntry[] {
  const baked = generated[lang]
  if (Array.isArray(baked) && baked.length > 0) {
    return baked as ChangelogEntry[]
  }
  return readFromMarkdown(lang)
}

export function getLatestVersion(fallback: string, lang: LandingLang = "en"): string {
  return getChangelog(lang)[0]?.version ?? fallback
}

export function getChangelogSourcePath(lang: LandingLang): string {
  return lang === "es" ? "CHANGELOG.es.md" : "CHANGELOG.md"
}
