import Image from "next/image"

/** Official brand marks from https://svgl.app (stored in /public/icons/ai/) */
export function AiBrandIcon({ src, className }: { src: string; className?: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={32}
      height={32}
      className={className}
      aria-hidden
      unoptimized
    />
  )
}

export const AI_BRAND_ICONS = {
  chatgpt: "/icons/ai/openai.svg",
  gemini: "/icons/ai/gemini.svg",
  claude: "/icons/ai/claude.svg",
  perplexity: "/icons/ai/perplexity.svg",
  /** Microsoft Copilot (not GitHub Copilot) — svgl.app/library/microsoft-copilot.svg */
  copilot: "/icons/ai/copilot.svg",
} as const
