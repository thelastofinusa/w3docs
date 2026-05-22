import { Play, AlertTriangle, Wallet } from "lucide-react"
import { useState } from "react"
import type { ReadFn, WriteFn } from "@/lib/abi"

import { CodeBlock } from "./code-block"
import { ParamInput } from "./param-input"
import { cn } from "@/lib/utils"
import { Icons } from "hugeicons-proxy"
import { Button } from "@/components/ui/button"

type Mode = "read" | "write"

export function FunctionCard({
  fn,
  mode,
  defaultOpen = false,
}: {
  fn: ReadFn | WriteFn
  mode: Mode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fn.inputs.map((p) => [p.name, ""]))
  )
  const [response, setResponse] = useState<null | {
    value: string
    timestamp: string
    gas: string
    flash: number
  }>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [executing, setExecuting] = useState(false)

  const accentText = mode === "read" ? "text-success" : "text-warning"
  const accentBg = mode === "read" ? "bg-success/10" : "bg-warning/10"
  const accentBorder =
    mode === "read" ? "border-success/30" : "border-warning/30"
  const buttonVariant = mode === "read" ? "success" : "warning"

  const handleTry = () => {
    if (mode === "read") {
      const out = (fn as ReadFn).mockOutput
      setResponse({
        value: out,
        timestamp: new Date().toLocaleTimeString(),
        gas: `${Math.floor(20000 + Math.random() * 4000).toLocaleString()}`,
        flash: Date.now(),
      })
    } else {
      setExecuting(true)
      setTimeout(() => {
        setExecuting(false)
        setResponse({
          value: `0x${Math.random().toString(16).slice(2).padEnd(64, "0").slice(0, 64)}`,
          timestamp: new Date().toLocaleTimeString(),
          gas: `${Math.floor(45000 + Math.random() * 15000).toLocaleString()}`,
          flash: Date.now(),
        })
      }, 900)
    }
  }

  const signature = `function ${fn.name}(${fn.inputs.map((i) => `${i.type} ${i.name}`).join(", ")})${
    mode === "read" ? ` view returns (${(fn as ReadFn).outputType})` : ""
  }`

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card transition-colors",
        open ? accentBorder : "border-border"
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-elevated/50"
      >
        <span
          className={cn(
            "inline-flex h-6 items-center rounded-md px-2 font-mono text-xs font-semibold",
            accentText,
            accentBg
          )}
        >
          {mode === "read" ? "GET" : "POST"}
        </span>
        <span className="font-mono text-sm font-semibold">{fn.name}</span>
        <span className="hidden text-sm text-muted-foreground md:inline">
          {fn.description}
        </span>
        <Icons.ArrowDown01Icon
          className={cn(
            "ml-auto size-4 text-muted-foreground transition-transform",
            {
              "rotate-180": open,
            }
          )}
        />
      </button>

      {open && (
        <div
          className="animate-fade-in border-t border-border px-4 py-4"
          style={{ backgroundImage: "var(--gradient-card-glow)" }}
        >
          <p className="mb-4 text-sm text-muted-foreground md:hidden">
            {fn.description}
          </p>

          <div className="mb-4">
            <CodeBlock code={signature} language="solidity" />
          </div>

          {fn.inputs.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Parameters
              </div>
              <div className="grid gap-3">
                {fn.inputs.map((p) => (
                  <ParamInput
                    key={p.name}
                    param={p}
                    value={values[p.name] ?? ""}
                    onChange={(v) => setValues((s) => ({ ...s, [p.name]: v }))}
                    accent={mode === "read" ? "success" : "warning"}
                  />
                ))}
              </div>
            </div>
          )}

          {mode === "read" && (
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Output
                </div>
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
                  {(fn as ReadFn).outputType}
                </span>
              </div>
              <div
                key={response?.flash ?? 0}
                className={response ? "flash-highlight rounded-md" : ""}
              >
                <CodeBlock
                  code={
                    response
                      ? JSON.stringify({ result: response.value }, null, 2)
                      : JSON.stringify(
                          { result: (fn as ReadFn).mockOutput },
                          null,
                          2
                        )
                  }
                  language="json"
                />
              </div>
              {response && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 text-success">
                    <Icons.CheckmarkCircle03Icon className="size-3.5" /> 200 OK
                  </span>
                  <span>· {response.timestamp}</span>
                  <span>
                    · gas used{" "}
                    <span className="font-mono text-foreground">
                      {response.gas}
                    </span>
                  </span>
                </div>
              )}
            </div>
          )}

          {mode === "write" && response && (
            <div className="mb-4">
              <div className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Transaction
              </div>
              <div key={response.flash} className="flash-highlight rounded-md">
                <CodeBlock
                  code={JSON.stringify(
                    {
                      txHash: response.value,
                      status: "success",
                      gasUsed: response.gas,
                    },
                    null,
                    2
                  )}
                  language="json"
                />
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-success">
                  <Icons.CheckmarkCircle03Icon className="size-3.5" /> Confirmed
                </span>
                <span>· {response.timestamp}</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {mode === "write" && !walletConnected ? (
              <Button
                variant="outline"
                onClick={() => setWalletConnected(true)}
                className="border-warning/40 bg-warning/10 text-warning hover:bg-warning/20"
              >
                <Icons.Wallet05Icon className="size-4" />
                Connect to Execute
              </Button>
            ) : (
              <Button
                variant={buttonVariant}
                onClick={handleTry}
                disabled={executing}
              >
                <Icons.PlayIcon className="size-4" />
                {executing
                  ? "Executing..."
                  : mode === "write"
                    ? "Execute"
                    : "Try it"}
              </Button>
            )}

            {mode === "write" && (
              <span className="inline-flex items-center gap-1.5 text-xs text-warning">
                <Icons.Alert02Icon className="size-3.5" />
                This will send a transaction.
              </span>
            )}

            {mode === "write" && walletConnected && (
              <span className="ml-auto inline-flex items-center gap-2 rounded-sm border border-border bg-background/60 px-2.5 py-1 font-mono text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                0x9f4c...A21e
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
