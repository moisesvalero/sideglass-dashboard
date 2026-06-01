export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://personal-dashboard.vercel.app"
).replace(/\/$/, "")

export const GITHUB_REPO = "https://github.com/moisesvalero/personal-dashboard"
export const GITHUB_RELEASES = `${GITHUB_REPO}/releases/latest`
export const APP_VERSION = "0.2.0"
