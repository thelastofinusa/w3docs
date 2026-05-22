import { ChevronDown, Radio } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { EventDef } from "@/lib/abi"
import { CodeBlock } from "./code-block"

function randAddr() {
  const hex = "0123456789abcdef"
  let a = "0x"
  for (let i = 0; i < 40; i++) a += hex[Math.floor(Math.random() * 16)]
  return a
}

export function EventCard({
  ev,
  defaultOpen = false,
}: {
  ev: EventDef
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [listening, setListening] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (listening) {
      timer.current = setInterval(() => {
        const args = ev.params.map((p) =>
          p.type === "address"
            ? `"${randAddr()}"`
            : `"${Math.floor(Math.random() * 1e18)}"`
        )
        const line = `${new Date().toLocaleTimeString()}  ${ev.name}(${args.join(", ")})`
        setLogs((l) => [line, ...l].slice(0, 5))
      }, 1500)
    }
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [listening, ev])

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-card ${open ? "border-info/30" : "border-border"}`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-elevated/50"
      >
        <span className="inline-flex h-6 items-center rounded-md bg-info/10 px-2 font-mono text-xs font-semibold text-info">
          EVENT
        </span>
        <span className="font-mono text-sm font-semibold">{ev.name}</span>
        <span className="hidden text-sm text-muted-foreground md:inline">
          {ev.description}
        </span>
        <ChevronDown
          className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="animate-fade-in border-t border-border px-4 py-4"
          style={{ backgroundImage: "var(--gradient-card-glow)" }}
        >
          <div className="mb-4">
            <div className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Indexed parameters
            </div>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {ev.params.map((p) => (
                <div
                  key={p.name}
                  className="rounded-md border border-border bg-background/60 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{p.name}</span>
                    {p.indexed && (
                      <span className="rounded bg-info/10 px-1.5 py-0.5 text-[10px] font-medium text-info">
                        indexed
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {p.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <CodeBlock code={ev.signature} language="solidity" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setListening((l) => !l)
                if (listening) setLogs([])
              }}
              className={`inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                listening
                  ? "border border-info/40 bg-info/10 text-info"
                  : "bg-info text-background hover:bg-info/90"
              }`}
            >
              <span className="relative inline-flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-2 w-2 rounded-full ${listening ? "pulse-dot bg-success" : "bg-current opacity-60"}`}
                />
              </span>
              <Radio className="h-4 w-4" />
              {listening ? "Listening live" : "Listen for events"}
            </button>
            {listening && (
              <span className="text-xs text-muted-foreground">
                Streaming mock logs…
              </span>
            )}
          </div>

          {logs.length > 0 && (
            <div className="mt-3 rounded-md border border-border bg-background/60 p-3 font-mono text-xs text-muted-foreground">
              {logs.map((l, i) => (
                <div key={i} className={i === 0 ? "text-foreground" : ""}>
                  {l}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
