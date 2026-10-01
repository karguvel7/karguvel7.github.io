"use client";

import { useState } from "react";
import { InteractiveTopology } from "@/components/interactive-topology";
import { heroAgentTopology } from "@/lib/content";

export function HeroAgentViz() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = heroAgentTopology.nodes.find((node) => node.id === selectedId);

  return (
    <div className="hero-agent-viz hero-agent-viz-live diagram-surface mt-10">
      <div className="diagram-surface-header">
        <span className="diagram-status" data-accent="emerald">
          Live topology
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Orchestration mesh</span>
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
          selected ? (
            <div className="topology-detail topology-detail-inline" data-accent={selected.accent}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{selected.label}</p>
              <p className="mt-2 text-sm text-ink">{selected.detail}</p>
            </div>
          ) : (
            <p className="topology-detail-placeholder text-sm text-muted">
              Click or focus a node to inspect the stage.
            </p>
          )
        }
      />
    </div>
  );
}
