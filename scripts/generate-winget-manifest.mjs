import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import path from "node:path"

const PACKAGE_IDENTIFIER = "MoisesValero.Sideglass"
const PACKAGE_NAME = "Sideglass"
const PUBLISHER = "Moises Valero"
const REPO_URL = "https://github.com/moisesvalero/sideglass-dashboard"
const LANDING_URL = "https://sideglass.moisesvalero.es"
const INSTALLER_ASSET_NAME = "Sideglass_x64-setup.exe"
const MANIFEST_VERSION = "1.12.0"

function readPackageVersion() {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"))
  return pkg.version
}

function parseArgs(argv) {
  const args = {}

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (!arg.startsWith("--")) {
      continue
    }

    const [rawKey, inlineValue] = arg.slice(2).split("=", 2)
    const key = rawKey.trim()
    const next = argv[index + 1]
    const value = inlineValue ?? (next && !next.startsWith("--") ? argv[++index] : "true")

    args[key] = value
  }

  return args
}

function quote(value) {
  return JSON.stringify(String(value))
}

function sha256(filePath) {
  const hash = createHash("sha256")
  hash.update(readFileSync(filePath))
  return hash.digest("hex").toUpperCase()
}

function findDefaultInstaller(version) {
  const nsisDirs = [
    path.join("src-tauri", "target", "x86_64-pc-windows-msvc", "release", "bundle", "nsis"),
    path.join("src-tauri", "target", "release", "bundle", "nsis"),
  ]

  for (const dir of nsisDirs) {
    if (!existsSync(dir)) {
      continue
    }

    const setup = readdirSync(dir)
      .filter((file) => file.endsWith("-setup.exe") && file.includes(version))
      .sort()
      .at(-1)

    if (setup) {
      return path.join(dir, setup)
    }
  }

  return null
}

function manifestDirFor(outputRoot, version) {
  return path.join(outputRoot, "manifests", "m", "MoisesValero", "Sideglass", version)
}

function writeManifestFile(filePath, content) {
  writeFileSync(filePath, `${content.trim()}\n`, "utf8")
  console.log(`[winget] wrote ${filePath}`)
}

async function getInstallerSha256(installerPath, providedSha256, installerUrl) {
  if (providedSha256) return providedSha256
  if (installerPath && existsSync(installerPath)) return sha256(installerPath)

  console.log(`[winget] Local installer not found, fetching from GitHub release: ${installerUrl}...`)
  try {
    const res = await fetch(installerUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
    const arrayBuffer = await res.arrayBuffer()
    const hash = createHash("sha256")
    hash.update(Buffer.from(arrayBuffer))
    return hash.digest("hex").toUpperCase()
  } catch (err) {
    console.error(`[winget] Failed to fetch release asset: ${err.message}`)
    return null
  }
}

const args = parseArgs(process.argv.slice(2))
const version = args.version ?? readPackageVersion()
const tag = args.tag ?? `v${version}`
const outputRoot = args.output ?? "winget"
const installerPath = args.installer ?? findDefaultInstaller(version)
const installerUrl =
  args["installer-url"] ?? `${REPO_URL}/releases/download/${tag}/${INSTALLER_ASSET_NAME}`

const installerSha256 = await getInstallerSha256(installerPath, args.sha256, installerUrl)

if (!installerSha256) {
  console.error(
    [
      "[winget] Missing installer hash.",
      "",
      "Pass a local installer so the script can calculate SHA256:",
      "  pnpm run winget:manifest -- --installer ./path/to/Sideglass_x64-setup.exe",
      "",
      "Or pass the hash directly:",
      "  pnpm run winget:manifest -- --sha256 <SHA256>",
    ].join("\n")
  )
  process.exit(1)
}

const manifestDir = manifestDirFor(outputRoot, version)
mkdirSync(manifestDir, { recursive: true })

writeManifestFile(
  path.join(manifestDir, `${PACKAGE_IDENTIFIER}.yaml`),
  `
# yaml-language-server: $schema=https://aka.ms/winget-manifest.version.1.12.0.schema.json
PackageIdentifier: ${quote(PACKAGE_IDENTIFIER)}
PackageVersion: ${quote(version)}
DefaultLocale: "en-US"
ManifestType: "version"
ManifestVersion: "${MANIFEST_VERSION}"
`
)

writeManifestFile(
  path.join(manifestDir, `${PACKAGE_IDENTIFIER}.installer.yaml`),
  `
# yaml-language-server: $schema=https://aka.ms/winget-manifest.installer.1.12.0.schema.json
PackageIdentifier: ${quote(PACKAGE_IDENTIFIER)}
PackageVersion: ${quote(version)}
Platform:
- "Windows.Desktop"
MinimumOSVersion: "10.0.19041.0"
InstallerType: "nullsoft"
Scope: "user"
InstallModes:
- "interactive"
- "silent"
UpgradeBehavior: "install"
ReleaseDate: "${new Date().toISOString().slice(0, 10)}"
Installers:
- Architecture: "x64"
  InstallerUrl: ${quote(installerUrl)}
  InstallerSha256: ${installerSha256}
ManifestType: "installer"
ManifestVersion: "${MANIFEST_VERSION}"
`
)

writeManifestFile(
  path.join(manifestDir, `${PACKAGE_IDENTIFIER}.locale.en-US.yaml`),
  `
# yaml-language-server: $schema=https://aka.ms/winget-manifest.defaultLocale.1.12.0.schema.json
PackageIdentifier: ${quote(PACKAGE_IDENTIFIER)}
PackageVersion: ${quote(version)}
PackageLocale: "en-US"
Publisher: ${quote(PUBLISHER)}
PublisherUrl: ${quote("https://moisesvalero.es")}
PublisherSupportUrl: ${quote(`${REPO_URL}/issues`)}
Author: ${quote(PUBLISHER)}
PackageName: ${quote(PACKAGE_NAME)}
PackageUrl: ${quote(LANDING_URL)}
License: "PolyForm Noncommercial License 1.0.0"
LicenseUrl: ${quote(`${REPO_URL}/blob/main/LICENSE`)}
Copyright: "Copyright (c) 2026 Moises Valero"
ShortDescription: "A customizable dashboard for a secondary Windows monitor."
Description: "Sideglass is a source-available desktop dashboard for Windows. It keeps weather, calendar, hardware status, notes, YouTube, and AI shortcuts visible on a secondary monitor."
Moniker: "sideglass"
Tags:
- "dashboard"
- "desktop"
- "hardware"
- "monitor"
- "tauri"
- "utilities"
- "weather"
ReleaseNotesUrl: ${quote(`${REPO_URL}/releases/tag/${tag}`)}
ManifestType: "defaultLocale"
ManifestVersion: "${MANIFEST_VERSION}"
`
)

writeManifestFile(
  path.join(manifestDir, `${PACKAGE_IDENTIFIER}.locale.es-ES.yaml`),
  `
# yaml-language-server: $schema=https://aka.ms/winget-manifest.locale.1.12.0.schema.json
PackageIdentifier: ${quote(PACKAGE_IDENTIFIER)}
PackageVersion: ${quote(version)}
PackageLocale: "es-ES"
Publisher: ${quote(PUBLISHER)}
PackageName: ${quote(PACKAGE_NAME)}
ShortDescription: "Dashboard personalizable para un monitor secundario en Windows."
Description: "Sideglass es una app de escritorio source available para Windows. Mantiene clima, calendario, estado del hardware, notas, YouTube y accesos a IA visibles en un monitor secundario."
Tags:
- "dashboard"
- "escritorio"
- "hardware"
- "monitor"
- "tauri"
- "utilidades"
- "clima"
ManifestType: "locale"
ManifestVersion: "${MANIFEST_VERSION}"
`
)

console.log("")
console.log(`[winget] Package: ${PACKAGE_IDENTIFIER} ${version}`)
console.log(`[winget] InstallerUrl: ${installerUrl}`)
console.log(`[winget] InstallerSha256: ${installerSha256}`)
console.log(`[winget] Validate with: winget validate ${manifestDir}`)
