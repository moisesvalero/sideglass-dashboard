import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  const disallowAppRoutes = ["/dashboard/", "/ai-hub/"]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowAppRoutes,
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot"],
        allow: "/",
        disallow: disallowAppRoutes,
      },
      {
        userAgent: ["ClaudeBot", "anthropic-ai", "Claude-Web"],
        allow: "/",
        disallow: disallowAppRoutes,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: disallowAppRoutes,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: disallowAppRoutes,
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: disallowAppRoutes,
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: disallowAppRoutes,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ""),
  }
}
