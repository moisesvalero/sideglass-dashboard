import type { Metadata } from "next"
import { landingContent, type LandingLang } from "@/lib/landing-content"
import {
  APP_NAME,
  APP_TAGLINE,
  AUTHOR_GITHUB,
  AUTHOR_LINKEDIN,
  AUTHOR_NAME,
  AUTHOR_SITE,
  GITHUB_REPO,
  LICENSE_URL,
  SITE_URL,
  WINDOWS_INSTALLER_URL,
} from "@/lib/site"

type FaqItem = (typeof landingContent)[LandingLang]["faq"][number]

const OG_IMAGE = {
  url: "/social-preview.png",
  width: 1200,
  height: 630,
  alt: "Sideglass — dashboard para monitor secundario en Windows",
}

export function landingPageUrl(lang: LandingLang): string {
  if (lang === "en") return `${SITE_URL}/en`
  if (lang === "zh") return `${SITE_URL}/zh`
  return SITE_URL
}

/** Texto plano de FAQ para JSON-LD y llms-full.txt */
export function faqAnswerPlainText(item: FaqItem): string {
  const parts = [item.a]
  if (item.steps?.length) parts.push(...item.steps)
  if (item.code) parts.push(item.code)
  if (item.note) parts.push(item.note)
  return parts.join(" ")
}

export function buildLandingTitle(lang: LandingLang): string {
  const copy = landingContent[lang]
  return `${APP_NAME} — ${copy.metaTitle}`
}

export function buildLandingMetadata(lang: LandingLang): Metadata {
  const copy = landingContent[lang]
  const pageUrl = landingPageUrl(lang)
  const title = buildLandingTitle(lang)

  return {
    title: { absolute: title },
    description: copy.metaDescription,
    keywords: copy.keywords,
    applicationName: APP_NAME,
    authors: [{ name: AUTHOR_NAME, url: AUTHOR_SITE }],
    creator: AUTHOR_NAME,
    publisher: APP_NAME,
    category: "technology",
    alternates: {
      canonical: pageUrl,
      languages: {
        es: SITE_URL,
        en: `${SITE_URL}/en`,
        zh: `${SITE_URL}/zh`,
        "x-default": SITE_URL,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description: copy.ogDescription,
      type: "website",
      locale: lang === "en" ? "en_US" : lang === "zh" ? "zh_CN" : "es_ES",
      alternateLocale:
        lang === "en"
          ? ["es_ES", "zh_CN"]
          : lang === "zh"
            ? ["es_ES", "en_US"]
            : ["en_US", "zh_CN"],
      url: pageUrl,
      siteName: APP_NAME,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: copy.ogDescription,
      images: [OG_IMAGE.url],
      creator: "@moisesvalero",
    },
  }
}

export function buildLandingJsonLd(lang: LandingLang, version: string, releaseDate?: string) {
  const copy = landingContent[lang]
  const pageUrl = landingPageUrl(lang)
  const title = buildLandingTitle(lang)
  const modified = releaseDate ?? new Date().toISOString().slice(0, 10)

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: APP_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/app-icon-1024.png`,
          width: 1024,
          height: 1024,
        },
        sameAs: [GITHUB_REPO, AUTHOR_GITHUB, AUTHOR_LINKEDIN, AUTHOR_SITE],
        founder: { "@id": `${SITE_URL}#author` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}#author`,
        name: AUTHOR_NAME,
        url: AUTHOR_SITE,
        sameAs: [AUTHOR_GITHUB, AUTHOR_LINKEDIN],
        jobTitle: "Software developer",
        knowsAbout: [
          "Desktop applications",
          "Windows utilities",
          "Tauri",
          "Next.js",
          "Dashboard widgets",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        name: APP_NAME,
        alternateName: APP_TAGLINE,
        url: SITE_URL,
        description: copy.metaDescription,
        inLanguage: ["es", "en", "zh"],
        publisher: { "@id": `${SITE_URL}#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description: copy.metaDescription,
        inLanguage: copy.htmlLang,
        isPartOf: { "@id": `${SITE_URL}#website` },
        about: { "@id": `${SITE_URL}#software` },
        dateModified: modified,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}/social-preview.png`,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}#software`,
        name: APP_NAME,
        alternateName: copy.metaTitle,
        operatingSystem: "Windows 10, Windows 11",
        applicationCategory: "DesktopApplication",
        applicationSubCategory: "UtilitiesApplication",
        softwareVersion: version,
        description: copy.metaDescription,
        url: SITE_URL,
        downloadUrl: WINDOWS_INSTALLER_URL,
        installUrl: WINDOWS_INSTALLER_URL,
        license: LICENSE_URL,
        inLanguage: copy.htmlLang,
        screenshot: [
          `${SITE_URL}/screenshots/portrait-dark.png`,
          `${SITE_URL}/screenshots/portrait-light.png`,
          `${SITE_URL}/screenshots/landscape-dark.png`,
        ],
        featureList: copy.featureGroups.flatMap((group) =>
          group.items.map((item) => `${item.label}: ${item.desc}`)
        ),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
        author: { "@id": `${SITE_URL}#author` },
        publisher: { "@id": `${SITE_URL}#organization` },
        dateModified: modified,
      },
      {
        "@type": "HowTo",
        "@id": `${pageUrl}#install`,
        name: copy.installTitle,
        description: copy.metaDescription,
        inLanguage: copy.htmlLang,
        step: copy.install.map((text, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          text,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        inLanguage: copy.htmlLang,
        mainEntity: copy.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faqAnswerPlainText(item),
          },
        })),
      },
    ],
  }
}
