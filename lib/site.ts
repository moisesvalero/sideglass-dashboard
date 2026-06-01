export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://personal-dashboard-gules-three.vercel.app"
).replace(/\/$/, "")

export const APP_NAME = "Sideglass"
export const APP_TAGLINE = "Panel para tu monitor secundario"

export const GITHUB_REPO = "https://github.com/moisesvalero/sideglass-dashboard"
export const GITHUB_ISSUES_NEW = `${GITHUB_REPO}/issues/new`

/** Stable NSIS asset name uploaded on every release (see .github/workflows/release.yml). */
export const WINDOWS_INSTALLER_NAME = "Sideglass_x64-setup.exe"
export const WINDOWS_INSTALLER_URL = `${GITHUB_REPO}/releases/latest/download/${WINDOWS_INSTALLER_NAME}`

export const GITHUB_RELEASES = `${GITHUB_REPO}/releases/latest`
export const LICENSE_URL = `${GITHUB_REPO}/blob/main/LICENSE`
export const APP_VERSION = "0.2.12"

export const AUTHOR_NAME = "Moises Valero"
export const AUTHOR_SITE = "https://moisesvalero.es"
export const AUTHOR_GITHUB = "https://github.com/moisesvalero"
export const AUTHOR_LINKEDIN = "https://www.linkedin.com/in/moisesvalero/"
