import type { Metadata } from "next"
import { LandingView } from "@/components/landing/landing-view"
import { landingContent } from "@/lib/landing-content"
import { SITE_URL } from "@/lib/site"

const copy = landingContent.es

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  keywords: copy.keywords,
  alternates: {
    canonical: `${SITE_URL}/landing`,
    languages: {
      es: `${SITE_URL}/landing`,
      en: `${SITE_URL}/en`,
      "x-default": `${SITE_URL}/landing`,
    },
  },
  openGraph: {
    title: "Desk Dashboard",
    description: copy.ogDescription,
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/landing`,
    siteName: "Desk Dashboard",
    images: [{ url: "/screenshots/hero.png", width: 960, height: 1640, alt: "Desk Dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Desk Dashboard",
    description: copy.ogDescription,
    images: ["/screenshots/hero.png"],
  },
}

export default function LandingPageEs() {
  return <LandingView lang="es" />
}
