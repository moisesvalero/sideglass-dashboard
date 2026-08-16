import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          es: SITE_URL,
          en: `${SITE_URL}/en`,
          zh: `${SITE_URL}/zh`,
        },
      },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          es: SITE_URL,
          en: `${SITE_URL}/en`,
          zh: `${SITE_URL}/zh`,
        },
      },
    },
    {
      url: `${SITE_URL}/zh`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          es: SITE_URL,
          en: `${SITE_URL}/en`,
          zh: `${SITE_URL}/zh`,
        },
      },
    },
  ]
}
