"use client";
import { useState } from "react";
import { Icons } from "hugeicons-proxy";

import { UnifiedContract } from "@/types";
import { Container } from "./container";
import { Separator } from "./ui/separator";

// const ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

export const Hero = ({ contract }: { contract: UnifiedContract }) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(contract.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="relative overflow-hidden border-b border-border"
      style={{ backgroundImage: "var(--gradient-hero)" }}
    >
      <Container className="py-10 md:py-14 lg:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {contract.name}
          </h1>
          {contract.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-1 text-xs font-medium text-success">
              <Icons.CheckmarkBadge03Icon className="size-3.5" />
              Verified
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Icons.Blockchain01Icon className="size-4" />
            {contract.chain}
          </span>
          <Separator
            orientation="vertical"
            className="my-auto hidden h-3 w-px md:inline-block"
          />
          <button
            aria-label="Copy address"
            onClick={copyAddress}
            className="inline-flex items-center gap-2"
          >
            <span className="text-xs text-foreground">
              {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
            </span>
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
  );
};
