import type { Metadata } from "next"
import { LandingView } from "@/components/landing/landing-view"
import { landingContent } from "@/lib/landing-content"
import { APP_NAME, SITE_URL } from "@/lib/site"

const ogImage = {
  url: "/social-preview.png",
  width: 1280,
  height: 640,
  alt: "Sideglass social preview",
}

const copy = landingContent.en

export const metadata: Metadata = {
  title: { absolute: APP_NAME },
  description: copy.metaDescription,
  keywords: copy.keywords,
  alternates: {
    canonical: `${SITE_URL}/en`,
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
    locale: "en_US",
    url: `${SITE_URL}/en`,
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

export default function LandingPageEn() {
  return <LandingView lang="en" />
}
