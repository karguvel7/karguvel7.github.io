"use client";

import { useState } from "react";
import { sectionAccent } from "@/lib/accents";
import { architectureLayers, platformAreas } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";

export function ArchitectureStack() {
  const accent = sectionAccent.architecture;
  const [active, setActive] = useState(0);

  return (
    <Section id="architecture" labelledBy="architecture-heading" accent={accent}>
      <SectionHeading
        id="architecture-heading"
        index="04"
        eyebrow="How I build systems"
        accent={accent}
        title="Architecture from UI to observability."
        lede="Microservices, events, APIs, CI/CD, Docker, deploy targets, and the signals that prove a system is healthy — grounded in the platforms and case studies on this site."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        <ol className="stack-layers glass-panel lg:col-span-5">
          {architectureLayers.map((layer, index) => {
            const isActive = index === active;
            return (
              <li key={layer.layer}>
                <button
                  type="button"
                  data-accent={layer.accent}
                  className={`stack-layer ${isActive ? "is-active" : ""}`}
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                >
                  <span className="font-mono text-[10px] text-faint">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mt-1 block text-sm font-medium text-ink">{layer.layer}</span>
                  <span className="mt-1 block text-xs text-muted">{layer.detail}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="lg:col-span-7">
          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {platformAreas.map((area, index) => (
              <article
                key={area.title}
                data-accent={index % 2 === 0 ? "cyan" : "amber"}
                className="platform-tile bg-canvas p-5 sm:p-6"
              >
                <h3 className="text-base font-medium text-ink">{area.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={area.title}>
                  {area.items.map((item) => (
                    <li key={item} data-accent="cyan" className="tag-chip">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-muted">{area.note}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Active layer:{" "}
            <span className="text-ink">{architectureLayers[active]?.layer}</span>
            <span className="px-2 text-faint" aria-hidden="true">
              —
            </span>
            {architectureLayers[active]?.detail}
          </p>
        </div>
      </div>
    </Section>
  );
}
