import Link from "next/link"
import type { Metadata } from "next"
import { APP_NAME, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `Cookie policy · ${APP_NAME}`,
  description:
    "Cookie policy for Sideglass, a free desktop dashboard for a secondary Windows monitor.",
}

export default function CookiesPage() {
  return (
    <main className="landing-page min-h-screen antialiased">
      <div className="landing-ambient" aria-hidden>
        <div className="landing-ambient-cyan" />
        <div className="landing-ambient-violet" />
      </div>

      <article className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <Link
          href="/en"
          className="mb-8 inline-flex text-sm text-[var(--landing-accent)] hover:underline underline-offset-2"
        >
          ← Back to home
        </Link>

        <h1 className="landing-display landing-hero-title mb-8">Cookie policy</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-[var(--landing-text-soft)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">
              1. What are cookies?
            </h2>
            <p>
              Cookies are small text files that websites store in your browser to remember
              preferences, improve experience, and collect anonymous usage data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">2. Cookies we use</h2>
            <p>
              Sideglass only uses technical cookies. We do not use third-party advertising or
              tracking cookies.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-[var(--landing-text)]">
                  User preferences (localStorage):
                </strong>{" "}
                your settings (widgets, layout, language) are stored exclusively in your browser.
                Nothing is sent to any server.
              </li>
              <li>
                <strong className="text-[var(--landing-text)]">Dark/light theme:</strong> your theme
                preference is saved in localStorage to maintain visual consistency across visits.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">
              3. Third-party cookies
            </h2>
            <p>
              This site does not load third-party cookies. External links (GitHub, LinkedIn,
              YouTube, PayPal) are managed by their respective platforms under their own privacy
              policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">
              4. Managing cookies
            </h2>
            <p>
              You can delete or block cookies from your browser settings. Since these are technical
              cookies, blocking them may affect certain parts of the site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">5. Contact</h2>
            <p>
              If you have questions about this policy, reach out at{" "}
              <a
                href="https://moisesvalero.es/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--landing-accent)] hover:underline"
              >
                moisesvalero.es/contact
              </a>
              .
            </p>
          </section>

          <p className="pt-4 text-sm text-[var(--landing-text-muted)]">Last updated: June 2026.</p>
        </div>
      </article>
    </main>
  )
}
