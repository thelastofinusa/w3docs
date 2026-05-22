"use client"
import * as React from "react"

import {
  Chain,
  CHAIN_NETWORK,
  events,
  readFunctions,
  writeFunctions,
} from "@/lib/abi"
import { Hero } from "../_components/hero"
import { TabBar, TabKey } from "../_components/tabBar"
import { Container } from "@/components/shared/container"
import { FunctionCard } from "../_components/function-card"
import { EventCard } from "../_components/event-card"

export default function Page() {
  const [chain, _setChain] = React.useState<Chain>("Ethereum")
  const [tab, setTab] = React.useState<TabKey>("read")
  const [search, _setSearch] = React.useState("")

  const q = search.trim().toLowerCase()
  const reads = React.useMemo(
    () => readFunctions.filter((f) => !q || f.name.toLowerCase().includes(q)),
    [q]
  )
  const writes = React.useMemo(
    () => writeFunctions.filter((f) => !q || f.name.toLowerCase().includes(q)),
    [q]
  )
  const evs = React.useMemo(
    () => events.filter((e) => !q || e.name.toLowerCase().includes(q)),
    [q]
  )

  return (
    <section className="relative overflow-hidden">
      <Hero network={CHAIN_NETWORK[chain]} />
      <TabBar active={tab} onChange={setTab} />
      <Container className="py-6 md:py-10">
        {tab === "read" && (
          <section className="animate-fade-in space-y-3">
            {reads.map((fn, i) => (
              <FunctionCard
                key={fn.name}
                fn={fn}
                mode="read"
                defaultOpen={i === 0}
              />
            ))}
            {reads.length === 0 && <EmptyState />}
          </section>
        )}
        {tab === "write" && (
          <section className="animate-fade-in space-y-3">
            {writes.map((fn) => (
              <FunctionCard key={fn.name} fn={fn} mode="write" />
            ))}
            {writes.length === 0 && <EmptyState />}
          </section>
        )}

        {tab === "events" && (
          <section className="animate-fade-in space-y-3">
            {evs.map((e) => (
              <EventCard key={e.name} ev={e} defaultOpen />
            ))}
            {evs.length === 0 && <EmptyState />}
          </section>
        )}
      </Container>
    </section>
  )
}

const EmptyState = () => {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center text-sm text-muted-foreground md:py-32 lg:py-52">
      No matches for your search.
    </div>
  )
}
