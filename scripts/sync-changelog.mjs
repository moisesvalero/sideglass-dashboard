import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()

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

function readFile(name) {
  return readFileSync(join(root, name), "utf8")
}

const payload = {
  es: parseChangelog(readFile("CHANGELOG.es.md")),
  en: parseChangelog(readFile("CHANGELOG.md")),
}

const out = join(root, "lib", "changelog.generated.json")
writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`, "utf8")
console.log(`Wrote ${out} (es: ${payload.es.length}, en: ${payload.en.length} versions)`)
