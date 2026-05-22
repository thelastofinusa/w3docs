import { Icons } from "hugeicons-proxy";
import type { ComponentType } from "react";
import { Container } from "./container";

export type TabKey = "read" | "write" | "events";

type TabDef = {
  key: TabKey;
  label: string;
  icon: ComponentType<{ className?: string }>;
  count: number;
};

export const TabBar = ({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) => {
  const tabs: TabDef[] = [
    {
      key: "read",
      label: "Read Functions",
      icon: Icons.BookOpen02Icon,
      count: 0,
    },
    {
      key: "write",
      label: "Write Functions",
      icon: Icons.PencilEdit02Icon,
      count: 0,
    },
    {
      key: "events",
      label: "Events",
      icon: Icons.TimelineEventIcon,
      count: 0,
    },
  ];

  return (
    <div className="sticky top-18 z-20 border-b border-border bg-background/90 backdrop-blur">
      <Container className="flex overflow-x-auto overflow-y-clip">
        {tabs.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`relative flex w-full items-center justify-center gap-2 p-3 text-sm font-medium whitespace-nowrap transition-colors sm:w-max ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className={`size-4 ${isActive ? "text-primary" : ""}`} />
              {t.label}
              <span className="hidden rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:flex">
                {t.count}
              </span>
              <span
                className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-all ${
                  isActive ? "bg-primary" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </Container>
    </div>
  );
};
