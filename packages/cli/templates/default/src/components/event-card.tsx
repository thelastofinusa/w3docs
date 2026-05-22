import { useEffect, useRef, useState } from "react";

import { CodeBlock } from "./code-block";
import { Button } from "@/components/ui/button";
import { Icons } from "hugeicons-proxy";
import { ContractEvent } from "@/types";

export function EventCard({ ev }: { ev: ContractEvent }) {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (listening) {
      timer.current = setInterval(() => {
        const args = ev.inputs.map((p) =>
          p.type === "address"
            ? `"0x${Math.random().toString(16).slice(2, 10)}..."`
            : `"${Math.floor(Math.random() * 1e18)}"`,
        );
        const line = `${new Date().toLocaleTimeString()}  ${ev.name}(${args.join(", ")})`;
        setLogs((l) => [line, ...l].slice(0, 5));
      }, 1500);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [listening, ev]);

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
        <Icons.ArrowDown01Icon
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
              {ev.inputs.map((p) => (
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
            <Button
              variant={listening ? "outline" : "info"}
              onClick={() => {
                setListening((l) => !l);
                if (listening) setLogs([]);
              }}
              className={
                listening
                  ? "border-info/40 bg-info/10 text-info hover:bg-info/20"
                  : ""
              }
            >
              <span className="relative inline-flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-2 w-2 rounded-full ${listening ? "pulse-dot bg-success" : "bg-current opacity-60"}`}
                />
              </span>
              <Icons.RadioIcon className="h-4 w-4" />
              {listening ? "Listening live" : "Listen for events"}
            </Button>
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
  );
}
