"use client";

import { useMemo, useState } from "react";
import { InteractiveTopology } from "@/components/interactive-topology";
import { heroAgentTopology } from "@/lib/content";

type Stage = (typeof heroAgentTopology.nodes)[number];

export function HeroAgentViz() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = heroAgentTopology.nodes.find((node) => node.id === selectedId);

  const links = useMemo(() => {
    if (!selected) return { upstream: [] as Stage[], downstream: [] as Stage[] };
    const byId = (id: string) => heroAgentTopology.nodes.find((node) => node.id === id);
    return {
      upstream: heroAgentTopology.edges
        .filter((edge) => edge.to === selected.id)
        .map((edge) => byId(edge.from))
        .filter((node): node is Stage => Boolean(node)),
      downstream: heroAgentTopology.edges
        .filter((edge) => edge.from === selected.id)
        .map((edge) => byId(edge.to))
        .filter((node): node is Stage => Boolean(node)),
    };
  }, [selected]);

  return (
    <div className="hero-agent-viz hero-agent-viz-live diagram-surface mt-10">
      <div className="diagram-surface-header">
        <span className="diagram-status" data-accent="emerald">
          Live topology
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {heroAgentTopology.nodes.length} stages · {heroAgentTopology.edges.length} links
        </span>
      </div>

      <InteractiveTopology
        viewBox={heroAgentTopology.viewBox}
        nodes={heroAgentTopology.nodes}
        edges={heroAgentTopology.edges}
        ariaLabel="Interactive AI system flow from user to services"
        variant="hero"
        showPulse
        selectedId={selectedId}
        onSelect={setSelectedId}
        footer={
          <div className="topology-detail-slot" aria-live="polite">
            {selected ? (
              <div className="topology-detail topology-detail-inline" data-accent={selected.accent}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{selected.label}</p>
                    <p className="mt-1.5 text-sm text-ink">{selected.detail}</p>
                  </div>
                  <button
                    type="button"
                    className="topology-detail-close font-mono text-[10px] uppercase tracking-[0.12em] text-muted"
                    onClick={() => setSelectedId(null)}
                  >
                    Clear
                  </button>
                </div>
                <div className="topology-links mt-3 grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      ["From", links.upstream],
                      ["To", links.downstream],
                    ] as const
                  ).map(([label, stages]) =>
                    stages.length ? (
                      <div key={label} className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</span>
                        {stages.map((stage) => (
                          <button
                            key={stage.id}
                            type="button"
                            data-accent={stage.accent}
                            className="topology-link-chip"
                            onClick={() => setSelectedId(stage.id)}
                          >
                            {stage.label}
                          </button>
                        ))}
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            ) : (
              <p className="topology-detail-placeholder text-sm text-muted">
                Select a stage to trace what feeds it and what it calls next.
              </p>
            )}
          </div>
        }
      />
    </div>
  );
}
