import { LandingView } from "@/components/landing/landing-view"
import { buildLandingMetadata } from "@/lib/seo"

export const metadata = buildLandingMetadata("en")

export default function LandingPageEn() {
  return <LandingView lang="en" />
}
