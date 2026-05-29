import { containerVariants } from "@/components/container"

const rows = [
  {
    title: "Generate from deployed contracts",
    body: "Provide a contract address and network. w3xp fetches metadata, resolves verified sources, and scaffolds a complete explorer-first interface without hand-coding pages.",
  },
  {
    title: "Interactive write functions",
    body: "Every write call becomes a real form, wired to the user's connected wallet. Inputs are typed, validated against each function parameter, and submitted as live transactions.",
  },
  {
    title: "Read contract state live",
    body: "View functions are executed against the connected RPC on load. Readers see the actual on-chain state instead of stale code snippets.",
  },
  {
    title: "Event timelines",
    body: "Each event gets a dedicated view with recent logs, decoded arguments, and filtering controls — ideal for protocol operations, audits, and integrations.",
  },
]

export const WhyW3xp = () => {
  return (
    <section
      className={containerVariants({
        size: "sm",
        className: "px-0! pt-24 pb-20",
      })}
    >
      <div className={containerVariants({ size: "xs" })}>
        <h2 className="mt-4 max-w-sm font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
          Interfaces that feel like block explorers
        </h2>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          A focused toolkit for protocol teams, DAOs, and OSS maintainers who
          want generated contract interfaces users can trust.
        </p>
      </div>

      <div className="mt-10 px-5 sm:mt-12 sm:px-6">
        {rows.map((r) => (
          <div
            key={r.title}
            className="grid grid-cols-1 gap-2 border-t border-border py-6 sm:grid-cols-3 sm:gap-4 md:gap-8"
          >
            <div className="sm:col-span-1">
              <h3 className="font-serif text-lg tracking-tight text-foreground">
                {r.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:col-span-2">
              {r.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
