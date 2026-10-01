"use client";

import { useCallback, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { sectionAccent } from "@/lib/accents";
import { skillsEcosystemTopology } from "@/lib/content";
import { InteractiveTopology } from "@/components/interactive-topology";
import { Section, SectionHeading } from "@/components/section";

export function SkillsEcosystem() {
  const accent = sectionAccent.skills;
  const uid = useId().replace(/:/g, "");
  const [selectedId, setSelectedId] = useState<string | null>(skillsEcosystemTopology.nodes[0]?.id ?? null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const cardRefs = useRef(new Map<string, HTMLLIElement>());

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

  const toggle = useCallback((id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  const selectFromMap = useCallback((id: string | null) => {
    setSelectedId(id);
    if (!id || window.matchMedia("(min-width: 1024px)").matches) return;
    const card = cardRefs.current.get(id);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    if (rect.top < 80 || rect.bottom > window.innerHeight) {
      card.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, []);

  const onCardKeyDown = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (event.key === "Escape" && selectedId === id) {
      event.preventDefault();
      setSelectedId(null);
    }
  };

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

      <div className="skills-layout mt-10 grid items-start gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="skills-topology diagram-surface p-0 lg:col-span-7">
          <div className="diagram-surface-header">
            <span className="diagram-status" data-accent={accent}>
              Skills topology
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {skillsEcosystemTopology.nodes.length} groups
            </span>
          </div>

          <InteractiveTopology
            viewBox={skillsEcosystemTopology.viewBox}
            nodes={topologyNodes}
            edges={skillsEcosystemTopology.edges}
            ariaLabel="Skills ecosystem topology map"
            variant="skills"
            selectedId={selectedId}
            onSelect={selectFromMap}
            externalHoverId={hoverId}
            hint="Drag nodes · pan empty space · tap a node for details"
          />
        </div>

        <ul className="skills-cards grid list-none gap-2.5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1" role="list">
          {skillsEcosystemTopology.nodes.map((node, index) => {
            const open = selectedId === node.id;
            const panelId = `${uid}-skill-${node.id}`;
            const buttonId = `${panelId}-toggle`;
            return (
              <li
                key={node.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(node.id, el);
                  else cardRefs.current.delete(node.id);
                }}
                className={`skill-card ${open ? "is-open" : ""} ${hoverId === node.id ? "is-linked" : ""}`}
                data-accent={node.accent}
                onPointerEnter={() => setHoverId(node.id)}
                onPointerLeave={() => setHoverId((current) => (current === node.id ? null : current))}
              >
                <button
                  id={buttonId}
                  type="button"
                  className="skill-card-toggle"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(node.id)}
                  onKeyDown={(event) => onCardKeyDown(event, node.id)}
                  onFocus={() => setHoverId(node.id)}
                  onBlur={() => setHoverId((current) => (current === node.id ? null : current))}
                >
                  <span className="skill-card-index font-mono text-[10px] tabular-nums" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="skill-card-title text-sm font-medium text-ink">{node.label}</span>
                  <span className="skill-card-count font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                    {node.items.length} skills
                  </span>
                  <span className="skill-card-chevron" aria-hidden="true" />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="skill-card-panel"
                  inert={!open}
                >
                  <div className="skill-card-panel-inner">
                    {node.layerDetail ? <p className="skill-card-detail text-sm text-muted">{node.layerDetail}</p> : null}
                    <ul className="skill-card-items flex flex-wrap gap-1.5" role="list">
                      {node.items.map((item) => (
                        <li key={item} className="tag-chip">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
