import type { Metadata } from "next"
import { Caveat, Inter } from "next/font/google"
import { SettingsProvider } from "@/lib/settings"
import { I18nProvider } from "@/lib/i18n"
import { APP_NAME, SITE_URL } from "@/lib/site"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
})
const caveat = Caveat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-hand",
  weight: ["500", "600", "700"],
})
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description: "Panel estilo macOS para tu monitor secundario en Windows",
  applicationName: APP_NAME,
  authors: [{ name: "Moises Valero" }],
  creator: "Moises Valero",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${caveat.variable} font-sans antialiased`}
        style={{ background: "transparent" }}
      >
        <I18nProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
