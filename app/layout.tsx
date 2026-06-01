import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { SettingsProvider } from "@/lib/settings"
import { I18nProvider } from "@/lib/i18n"
import { APP_NAME, SITE_URL } from "@/lib/site"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description: "Premium macOS-style panel for your second monitor on Windows",
  applicationName: APP_NAME,
  authors: [{ name: "Moises Valero" }],
  creator: "Moises Valero",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geist.className} font-sans antialiased`}
        style={{ background: "transparent" }}
      >
        <I18nProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
