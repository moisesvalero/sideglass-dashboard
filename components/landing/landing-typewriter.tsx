"use client"

import { useEffect, useMemo, useState } from "react"

type LandingTypewriterProps = {
  words: string[]
  fallback: string
}

const TYPE_MS = 42
const DELETE_MS = 24
const HOLD_MS = 1350

export function LandingTypewriter({ words, fallback }: LandingTypewriterProps) {
  const phrases = useMemo(() => (words.length > 0 ? words : [fallback]), [fallback, words])
  const longestPhrase = useMemo(
    () =>
      phrases.reduce((longest, phrase) => (phrase.length > longest.length ? phrase : longest), ""),
    [phrases]
  )
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [visibleLength, setVisibleLength] = useState(phrases[0]?.length ?? fallback.length)
  const [isDeleting, setIsDeleting] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener("change", updatePreference)

    return () => mediaQuery.removeEventListener("change", updatePreference)
  }, [])

  useEffect(() => {
    if (reducedMotion || phrases.length <= 1) {
      setPhraseIndex(0)
      setVisibleLength(phrases[0]?.length ?? fallback.length)
      setIsDeleting(false)
      return
    }

    const currentPhrase = phrases[phraseIndex]
    const hasTypedPhrase = visibleLength === currentPhrase.length
    const hasDeletedPhrase = visibleLength === 0
    const delay = hasTypedPhrase && !isDeleting ? HOLD_MS : isDeleting ? DELETE_MS : TYPE_MS

    const timeout = window.setTimeout(() => {
      if (!isDeleting && hasTypedPhrase) {
        setIsDeleting(true)
        return
      }

      if (isDeleting && hasDeletedPhrase) {
        setPhraseIndex((index) => (index + 1) % phrases.length)
        setIsDeleting(false)
        return
      }

      setVisibleLength((length) => length + (isDeleting ? -1 : 1))
    }, delay)

    return () => window.clearTimeout(timeout)
  }, [fallback.length, isDeleting, phraseIndex, phrases, reducedMotion, visibleLength])

  const visiblePhrase = reducedMotion ? phrases[0] : phrases[phraseIndex].slice(0, visibleLength)

  return (
    <span className="landing-typewriter" aria-label={phrases[0]}>
      <span className="landing-typewriter-sizer" aria-hidden>
        {longestPhrase}
      </span>
      <span className="landing-typewriter-text" aria-hidden>
        {visiblePhrase}
        <span className="landing-typewriter-caret" aria-hidden />
      </span>
    </span>
  )
}
