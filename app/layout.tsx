import type { Metadata } from "next"
import { Architects_Daughter } from "next/font/google"
import { SettingsProvider } from "@/lib/settings"
import { I18nProvider } from "@/lib/i18n"
import { APP_NAME, APP_TAGLINE, SITE_URL } from "@/lib/site"
import "./globals.css"

const architectsDaughter = Architects_Daughter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-hand",
  weight: "400",
})
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "Sideglass: dashboard gratuito para monitor secundario en Windows con clima, calendario, hardware y dock de IAs.",
  applicationName: APP_NAME,
  authors: [{ name: "Moises Valero", url: "https://moisesvalero.es" }],
  creator: "Moises Valero",
  publisher: APP_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "llms-txt": `${SITE_URL}/llms.txt`,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs" />
      </head>
      <body
        className={`${architectsDaughter.variable} font-sans antialiased`}
        style={{ background: "transparent" }}
      >
        <I18nProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
