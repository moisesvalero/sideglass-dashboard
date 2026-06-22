import { LandingView } from "@/components/landing/landing-view"
import { buildLandingMetadata } from "@/lib/seo"

export const metadata = buildLandingMetadata("es")

export default function HomePage() {
  return <LandingView lang="es" />
}
