import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

// Resolve the repo root from this script's location (scripts/..), not cwd,
// so it works regardless of where the build is invoked from.
const root = join(dirname(fileURLToPath(import.meta.url)), "..")

function parseChangelog(raw) {
  const entries = []
  let current = null
  let group = null

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

function readEntries(name) {
  const path = join(root, name)
  if (!existsSync(path)) return null
  try {
    return parseChangelog(readFileSync(path, "utf8"))
  } catch {
    return null
  }
}

const out = join(root, "lib", "changelog.generated.json")

const es = readEntries("CHANGELOG.es.md")
const en = readEntries("CHANGELOG.md")

// If the markdown files are missing (e.g. excluded from a deployment), keep the
// committed JSON instead of failing the build.
if (!es && !en) {
  console.warn(
    "[sync-changelog] CHANGELOG.md/.es.md not found; keeping committed changelog.generated.json"
  )
  process.exit(0)
}

let previous = { es: [], en: [] }
if (existsSync(out)) {
  try {
    previous = JSON.parse(readFileSync(out, "utf8"))
  } catch {
    /* ignore malformed previous file */
  }
}

const payload = {
  es: es ?? previous.es ?? [],
  en: en ?? previous.en ?? [],
}

writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`, "utf8")
console.log(
  `[sync-changelog] wrote ${out} (es: ${payload.es.length}, en: ${payload.en.length} versions)`
)
