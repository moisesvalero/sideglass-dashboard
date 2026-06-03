const RELEASES_URL =
  "https://api.github.com/repos/moisesvalero/sideglass-dashboard/releases?per_page=100"

const INSTALLER_RE = /Sideglass(?:_\d+\.\d+\.\d+)?_x64-setup\.exe$/i

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value)
}

function padRight(value, width) {
  return value.padEnd(width, " ")
}

async function fetchReleases() {
  const response = await fetch(RELEASES_URL, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "sideglass-download-stats",
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

const releases = await fetchReleases()
let totalInstallerDownloads = 0
let shownReleases = 0

console.log("Sideglass release downloads")
console.log("")

for (const release of releases) {
  const installerAssets = release.assets.filter((asset) => INSTALLER_RE.test(asset.name))

  if (installerAssets.length === 0) {
    continue
  }

  shownReleases += 1
  console.log(`${release.tag_name}${release.prerelease ? " (prerelease)" : ""}`)

  for (const asset of installerAssets) {
    totalInstallerDownloads += asset.download_count
    console.log(`  ${padRight(asset.name, 38)} ${formatNumber(asset.download_count)}`)
  }

  console.log("")
}

if (shownReleases === 0) {
  console.log("No installer assets found.")
  process.exit(0)
}

console.log(`Total installer downloads: ${formatNumber(totalInstallerDownloads)}`)
