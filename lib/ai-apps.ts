import { AI_BRAND_ICONS, type AiIconSrc } from "@/components/icons/ai-brand-icon"

export type AiApp = {
  id: string
  name: string
  icon: AiIconSrc
  url: string
}

export const AI_APPS: AiApp[] = [
  { id: "chatgpt", name: "ChatGPT", icon: AI_BRAND_ICONS.chatgpt, url: "https://chatgpt.com" },
  { id: "gemini", name: "Gemini", icon: AI_BRAND_ICONS.gemini, url: "https://gemini.google.com" },
  { id: "claude", name: "Claude", icon: AI_BRAND_ICONS.claude, url: "https://claude.ai" },
  {
    id: "perplexity",
    name: "Perplexity",
    icon: AI_BRAND_ICONS.perplexity,
    url: "https://www.perplexity.ai",
  },
  {
    id: "copilot",
    name: "Microsoft Copilot",
    icon: AI_BRAND_ICONS.copilot,
    url: "https://copilot.microsoft.com",
  },
]

const AI_APP_IDS = new Set(AI_APPS.map((app) => app.id))

export function isAiAppId(id: string): boolean {
  return AI_APP_IDS.has(id)
}

export function getAiAppById(id: string): AiApp | undefined {
  return AI_APPS.find((app) => app.id === id)
}

export function getAiAppUrl(id: string): string {
  return getAiAppById(id)?.url ?? AI_APPS[0].url
}
