import type React from "react"
import type { Metadata, Viewport } from "next"
import {
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Noto_Sans_Arabic,
  Noto_Sans_Bengali,
  Noto_Sans_Devanagari,
  Noto_Sans_Ethiopic,
} from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/shared/theme-provider"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { Toaster } from "@/components/ui/toaster"
import { MotionProvider, motionBootScript } from "@/components/motion/motion-provider"
import { I18nProvider } from "@/i18n/client"
import { getI18n } from "@/i18n/server"
import { site } from "@/lib/site"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
})
// Script fonts: unicode-range subsets, so browsers only download them when those glyphs appear.
const notoArabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-noto-arabic", preload: false })
const notoEthiopic = Noto_Sans_Ethiopic({ subsets: ["ethiopic"], variable: "--font-noto-ethiopic", preload: false })
const notoDevanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-noto-devanagari", preload: false })
const notoBengali = Noto_Sans_Bengali({ subsets: ["bengali"], variable: "--font-noto-bengali", preload: false })

const fontVars = [geistSans, geistMono, instrumentSerif, notoArabic, notoEthiopic, notoDevanagari, notoBengali]
  .map((f) => f.variable)
  .join(" ")

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.homeTitle, template: `%s · ${t.meta.siteTitle}` },
    description: t.meta.siteDescription,
    applicationName: t.meta.siteTitle,
    openGraph: {
      type: "website",
      siteName: t.meta.siteTitle,
      title: t.meta.homeTitle,
      description: t.meta.siteDescription,
    },
    twitter: { card: "summary_large_image", title: t.meta.homeTitle, description: t.meta.siteDescription },
    // Favicons come from src/app/icon.png, apple-icon.png and favicon.ico (Next file conventions).
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1124" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { locale, dir, t } = await getI18n()

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={fontVars}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <I18nProvider value={{ locale, dir, t }}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <div aria-hidden className="aurora" />
            <MotionProvider />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
