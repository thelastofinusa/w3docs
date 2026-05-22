import { ContractFunction } from "@/types";
import { Input } from "./ui/input";
import { Icons } from "hugeicons-proxy";

export function ParamInput({
  param,
  value,
  onChange,
  accent = "primary",
}: {
  param: ContractFunction["inputs"][number];
  value: string;
  onChange: (v: string) => void;
  accent?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2 text-sm">
        <span className="font-mono font-medium text-foreground">
          {param.name}
        </span>
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
          {param.type}
        </span>
        <span className="text-xs font-medium text-destructive">*required</span>
        {param.description && (
          <Icons.InformationCircleIcon className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${param.type}`}
        className="h-9 font-mono"
      />
    </div>
  );
}
