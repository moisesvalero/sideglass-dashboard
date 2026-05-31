import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SettingsProvider } from "@/lib/settings"
import { I18nProvider } from "@/lib/i18n"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Premium visionOS-style vertical dashboard",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} ${geistMono.variable} font-sans antialiased`}
        style={{ background: "transparent" }}
      >
        <I18nProvider>
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </I18nProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
