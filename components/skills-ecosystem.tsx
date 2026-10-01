"use client";

import { useState } from "react";
import { sectionAccent } from "@/lib/accents";
import { skillGroups } from "@/lib/content";
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

      <ul className="skills-grid mt-12 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group) => {
          const isActive = activeId === group.id;
          return (
            <li key={group.id}>
              <button
                type="button"
                data-accent={group.accent}
                className={`skill-orbit diagram-surface w-full p-5 text-left ${isActive ? "is-active" : ""}`}
                onClick={() => setActiveId(isActive ? null : group.id)}
                aria-expanded={isActive}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{group.title}</p>
                <ul className={`mt-3 space-y-1.5 text-sm ${isActive ? "text-ink" : "text-muted"}`}>
                  {(isActive ? group.items : group.items.slice(0, 3)).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                  {!isActive && group.items.length > 3 ? (
                    <li className="text-faint">+{group.items.length - 3} more</li>
                  ) : null}
                </ul>
              </button>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
