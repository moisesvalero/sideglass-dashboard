import type { Metadata } from "next"
import { LandingView } from "@/components/landing/landing-view"
import { landingContent } from "@/lib/landing-content"
import { APP_NAME, SITE_URL } from "@/lib/site"

const ogImage = {
  url: "/screenshots/landscape-dark.png",
  width: 1120,
  height: 780,
  alt: "Sideglass on a landscape monitor",
}

const copy = landingContent.es

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  keywords: copy.keywords,
  alternates: {
    canonical: SITE_URL,
    languages: {
      es: SITE_URL,
      en: `${SITE_URL}/en`,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    title: APP_NAME,
    description: copy.ogDescription,
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: APP_NAME,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: copy.ogDescription,
    images: [ogImage.url],
  },
}

export default function HomePage() {
  return <LandingView lang="es" />
}
