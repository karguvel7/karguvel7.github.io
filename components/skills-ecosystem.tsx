"use client";

import { useState } from "react";
import { sectionAccent } from "@/lib/accents";
import { skillGroups } from "@/lib/content";
import { RevealStagger } from "@/components/reveal-stagger";
import { Section, SectionHeading } from "@/components/section";

export function SkillsEcosystem() {
  const accent = sectionAccent.skills;
  const [activeId, setActiveId] = useState<string | null>(null);

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

      <RevealStagger
        asGrid
        className="skills-grid mt-10 grid auto-rows-fr grid-cols-1 gap-3 min-[480px]:grid-cols-2 min-[480px]:gap-4 lg:grid-cols-4"
      >
        {skillGroups.map((group, index) => {
          const isActive = activeId === group.id;
          const visibleItems = isActive ? group.items : group.items.slice(0, 3);
          const hiddenCount = group.items.length - visibleItems.length;

          return (
            <li key={group.id} className="h-full min-h-0">
              <button
                type="button"
                data-accent={group.accent}
                className={`skill-card skill-orbit diagram-surface flex h-full min-h-[11.5rem] w-full flex-col p-0 text-left ${isActive ? "is-active" : ""}`}
                onClick={() => setActiveId(isActive ? null : group.id)}
                aria-expanded={isActive}
              >
                <div className="skill-card-head flex items-start justify-between gap-3 border-b border-line/50 px-5 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{group.title}</p>
                  <span className="skill-card-seq shrink-0 font-mono text-[11px] tabular-nums text-faint" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-5 py-4">
                  <ul className={`skill-card-list list-none space-y-0 pl-0 text-sm ${isActive ? "text-ink" : "text-muted"}`}>
                    {visibleItems.map((item) => (
                      <li key={item} className="skill-card-item border-b border-line/35 py-2.5 last:border-b-0">
                        {item}
                      </li>
                    ))}
                  </ul>

                  {hiddenCount > 0 && !isActive ? (
                    <p className="skill-card-more mt-auto pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                      +{hiddenCount} more
                    </p>
                  ) : null}

                  {isActive && group.items.length > 3 ? (
                    <p className="skill-card-more mt-auto pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                      Show less
                    </p>
                  ) : null}
                </div>
              </button>
            </li>
          );
        })}
      </RevealStagger>
    </Section>
  );
}
