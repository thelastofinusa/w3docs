import { Icons } from "hugeicons-proxy";
import { useState } from "react";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="group relative overflow-hidden rounded-md border border-border bg-background/60">
      {language && (
        <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-xs text-muted-foreground">
          <span className="font-mono">{language}</span>
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
          >
            {copied ? (
              <Icons.CopyCheck className="size-3.5 text-success" />
            ) : (
              <Icons.CopyIcon className="size-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}
