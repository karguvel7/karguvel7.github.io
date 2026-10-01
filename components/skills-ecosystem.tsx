"use client";

import { useMemo, useState } from "react";
import { sectionAccent } from "@/lib/accents";
import { skillGroups, skillsEcosystemTopology } from "@/lib/content";
import { InteractiveTopology } from "@/components/interactive-topology";
import { Section, SectionHeading } from "@/components/section";

export function SkillsEcosystem() {
  const accent = sectionAccent.skills;
  const [selectedId, setSelectedId] = useState<string | null>(skillGroups[0]?.id ?? null);

  const selectedNode = useMemo(
    () => skillsEcosystemTopology.nodes.find((node) => node.id === selectedId) ?? null,
    [selectedId],
  );

  const topologyNodes = useMemo(
    () =>
      skillsEcosystemTopology.nodes.map((node) => ({
        id: node.id,
        label: node.label,
        x: node.x,
        y: node.y,
        accent: node.accent,
        detail: node.layerDetail ?? undefined,
      })),
    [],
  );

  return (
    <Section id="skills" labelledBy="skills-heading" accent={accent}>
      <SectionHeading
        id="skills-heading"
        index="02"
        eyebrow="Skills"
        accent={accent}
        title="An ecosystem built for production systems."
        lede="Frontend through AI, cloud, DevOps, and architecture — grouped the way the work actually ships."
      />

      <div className="skills-topology mt-10 diagram-surface p-0">
        <div className="diagram-surface-header">
          <span className="diagram-status" data-accent={accent}>
            Skills topology
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Select a node</span>
        </div>

        <InteractiveTopology
          viewBox={skillsEcosystemTopology.viewBox}
          nodes={topologyNodes}
          edges={skillsEcosystemTopology.edges}
          ariaLabel="Skills ecosystem topology map"
          variant="skills"
          selectedId={selectedId}
          onSelect={setSelectedId}
          hint="Drag to rearrange · pan empty space · tap a node for details"
        />

        <div className="skills-topology-detail" data-accent={selectedNode?.accent ?? accent}>
          {selectedNode ? (
            <>
              <div className="skills-topology-detail-head flex items-start justify-between gap-4 border-b border-line/45 px-5 py-4 sm:px-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{selectedNode.label}</p>
                  {selectedNode.layerDetail ? (
                    <p className="mt-2 max-w-2xl text-sm text-muted">{selectedNode.layerDetail}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="skills-topology-close font-mono text-[10px] uppercase tracking-[0.12em] text-faint"
                  onClick={() => setSelectedId(null)}
                >
                  Clear
                </button>
              </div>
              <ul className="skills-topology-items list-none space-y-0 px-5 py-3 sm:px-6">
                {selectedNode.items.map((item) => (
                  <li key={item} className="skill-card-item border-b border-line/35 py-2.5 text-sm text-ink last:border-b-0">
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="px-5 py-6 text-sm text-muted sm:px-6">
              Choose a node in the map to see stack details from the résumé groups.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
