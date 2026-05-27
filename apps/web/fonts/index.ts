import { cn } from "@w3docs/ui/lib/utils"
import localFont from "next/font/local"

const fontSans = localFont({
  src: "./BricolageGrotesque/BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf",
  variable: "--font-sans",
  preload: true,
})

const fontSerif = localFont({
  src: [
    {
      path: "./PTSerif/PTSerif-Regular.ttf",
      weight: "400",
    },
    {
      path: "./PTSerif/PTSerif-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-serif",
  preload: true,
})

const fontMono = localFont({
  src: "./JetBrainsMono/JetBrainsMono-VariableFont_wght.ttf",
  variable: "--font-mono",
  preload: true,
})

export const fontVariable = (className?: string) =>
  cn(fontSans.variable, fontSerif.variable, fontMono.variable, className)
