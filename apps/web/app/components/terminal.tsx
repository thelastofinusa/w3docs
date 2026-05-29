"use client"
import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface Props {
  label?: string
  command: string
}

export const TerminalBlock: React.FC<Props> = ({ label, command }) => {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* noop */
    }
  }

  return (
    <div className="group relative flex-1 rounded-lg border border-border bg-card">
      {label && (
        <div className="px-4 pt-3 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          {label}
        </div>
      )}
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <pre className="overflow-x-auto font-mono text-xs leading-relaxed sm:text-[13px]">
          <code>
            {command.split("\n").map((line, i) => (
              <div key={i}>
                <span className="mt-px text-muted-foreground select-none">
                  ${" "}
                </span>
                {line}
              </div>
            ))}
          </code>
        </pre>
        <button
          onClick={onCopy}
          aria-label="Copy command"
          className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  )
}
