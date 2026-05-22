import { useState } from "react";
import { Hero } from "./hero";
import { TabBar, TabKey } from "./tab-bar";
import { FunctionCard } from "./function-card";
import { EventCard } from "./event-card";
import type { UnifiedContract } from "../types";

export function ContractExplorer({ contract }: { contract: UnifiedContract }) {
  const [tab, setTab] = useState<TabKey>("read");
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();
  const reads = contract.functions
    .filter((f) => f.type === "read")
    .filter((f) => !q || f.name.toLowerCase().includes(q));
  const writes = contract.functions
    .filter((f) => f.type === "write")
    .filter((f) => !q || f.name.toLowerCase().includes(q));
  const events = contract.events.filter(
    (e) => !q || e.name.toLowerCase().includes(q),
  );

  return (
    <div className="min-h-screen">
      <Hero contract={contract} />
      <TabBar active={tab} onChange={setTab} />
      <div className="max-w-5xl mx-auto px-6 py-6 md:py-10">
        {tab === "read" && (
          <div className="space-y-3">
            {reads.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No read functions found.
              </p>
            )}
            {reads.map((fn) => (
              <FunctionCard key={fn.name} fn={fn} mode="read" />
            ))}
          </div>
        )}
        {tab === "write" && (
          <div className="space-y-3">
            {writes.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No write functions found.
              </p>
            )}
            {writes.map((fn) => (
              <FunctionCard key={fn.name} fn={fn} mode="write" />
            ))}
          </div>
        )}
        {tab === "events" && (
          <div className="space-y-3">
            {events.length === 0 && (
              <p className="text-muted-foreground text-sm">No events found.</p>
            )}
            {events.map((ev) => (
              <EventCard key={ev.name} ev={ev} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
