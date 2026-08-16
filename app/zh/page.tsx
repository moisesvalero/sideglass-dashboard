import { LandingView } from "@/components/landing/landing-view"
import { buildLandingMetadata } from "@/lib/seo"

export const metadata = buildLandingMetadata("zh")

export default function LandingPageZh() {
  return <LandingView lang="zh" />
}
