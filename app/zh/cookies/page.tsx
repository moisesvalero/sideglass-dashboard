import Link from "next/link"
import type { Metadata } from "next"
import { APP_NAME, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `Cookie 政策 · ${APP_NAME}`,
  description: "Sideglass（适用于 Windows 副屏的免费桌面仪表盘）的 Cookie 政策。",
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
          href="/zh"
          className="mb-8 inline-flex text-sm text-[var(--landing-accent)] hover:underline underline-offset-2"
        >
          ← 返回首页
        </Link>

        <h1 className="landing-display landing-hero-title mb-8">Cookie 政策</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-[var(--landing-text-soft)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">1. 什么是 Cookie？</h2>
            <p>
              Cookie
              是网站存储在浏览器中的小型文本文件，用于记住偏好设置、改善体验以及收集匿名的使用数据。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">
              2. 我们使用的 Cookie
            </h2>
            <p>Sideglass 仅使用技术性 Cookie。我们不使用第三方广告或跟踪 Cookie。</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-[var(--landing-text)]">
                  用户偏好设置（localStorage）：
                </strong>{" "}
                你的设置（小组件、布局、语言）仅存储在浏览器中，不会发送到任何服务器。
              </li>
              <li>
                <strong className="text-[var(--landing-text)]">深色/浅色主题：</strong>
                主题偏好保存在 localStorage 中，以保证多次访问时界面风格一致。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">3. 第三方 Cookie</h2>
            <p>
              本站不会加载第三方
              Cookie。外部链接（GitHub、LinkedIn、YouTube、PayPal）由各自平台依照其隐私政策管理。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">4. 管理 Cookie</h2>
            <p>
              你可以在浏览器设置中删除或阻止 Cookie。由于这些属于技术性
              Cookie，阻止它们可能会影响网站的某些功能。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--landing-text)]">5. 联系方式</h2>
            <p>
              如果你对本政策有任何疑问，请通过{" "}
              <a
                href="mailto:info@moisesvalero.es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--landing-accent)] hover:underline"
              >
                moisesvalero.es/contact
              </a>{" "}
              与我们联系。
            </p>
          </section>

          <p className="pt-4 text-sm text-[var(--landing-text-muted)]">最后更新：2026 年 6 月。</p>
        </div>
      </article>
    </main>
  )
}
