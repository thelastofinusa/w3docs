import { Metadata } from "next"
import { imagePath, assetPath } from "@typest/nextjs"

import "./globals.css"
import { fontVariable } from "@/fonts"
import { siteConfig } from "@/config/site.config"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { ThemeProvider } from "@/components/provider/theme.provider"

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.slogan}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url as string),
  authors: [
    {
      name: siteConfig.nickname,
      url: `https://x.com/${siteConfig.username}`,
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: {
      default: `${siteConfig.name} - ${siteConfig.slogan}`,
      template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}${imagePath("opengraph.png")}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: `${siteConfig.name} - ${siteConfig.slogan}`,
      template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    images: [`${siteConfig.url}${imagePath("opengraph.png")}`],
    creator: `@${siteConfig.username}`,
  },
  icons: {
    icon: [
      {
        url: imagePath("logo-black.svg"),
        media: "(prefers-color-scheme: light)",
      },
      {
        url: imagePath("logo-white.svg"),
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  manifest: `${siteConfig.url}${assetPath("site.webmanifest")}`,
}

export default function RootLayout(props: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontVariable("antialiased")}>
        <ThemeProvider>
          <Header />
          <main className="flex-1">{props.children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
