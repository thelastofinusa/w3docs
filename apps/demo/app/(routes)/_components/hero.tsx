"use client"
import { useState } from "react"
import { Icons } from "hugeicons-proxy"

import { Separator } from "@/components/ui/separator"
import { Container } from "@/components/shared/container"

const ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

export const Hero = ({ network }: { network: string }) => {
  const [copied, setCopied] = useState(false)
  const short = `${ADDRESS.slice(0, 6)}...${ADDRESS.slice(-4)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }
  return (
    <section
      className="relative overflow-hidden border-b border-border"
      style={{ backgroundImage: "var(--gradient-hero)" }}
    >
      <Container className="py-10 md:py-14 lg:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            USDC Token
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-1 text-xs font-medium text-success">
            <Icons.CheckmarkBadge03Icon className="size-3.5" />
            Verified
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Icons.Blockchain01Icon className="size-4" />
            {network}
          </span>
          <Separator
            orientation="vertical"
            className="my-auto hidden h-3 w-px md:inline-block"
          />
          <button
            aria-label="Copy address"
            onClick={copy}
            className="inline-flex items-center gap-2"
          >
            <span className="text-xs text-foreground">{short}</span>
            <span className="text-muted-foreground transition-colors hover:text-primary">
              {copied ? (
                <Icons.CopyCheck className="size-3.5 text-success" />
              ) : (
                <Icons.CopyIcon className="size-3.5" />
              )}
            </span>
          </button>
        </div>

        <p className="mt-4 max-w-xl text-sm text-muted-foreground">
          Interactive documentation generated from the contract ABI. Inspect
          read methods, simulate writes, and listen to events — all from one
          place.
        </p>
      </Container>
    </section>
  )
}
