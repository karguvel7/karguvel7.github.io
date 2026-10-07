"use client";

import { useMemo, useState } from "react";
import { SKILLS, type SkillFamily } from "@/lib/data";
import { TechLogo } from "@/components/tech-logo";

const families: SkillFamily[] = [
  "Frontend",
  "Backend",
  "AI",
  "Data",
  "Cloud",
  "Mobile",
  "Practices",
];

export function SkillsSection() {
  const [filter, setFilter] = useState<SkillFamily | "All">("All");
  const [active, setActive] = useState(SKILLS[0]);

  const visible = useMemo(
    () => (filter === "All" ? SKILLS : SKILLS.filter((s) => s.family === filter)),
    [filter],
  );

  return (
    <section id="skills" className="section-pad border-t border-line">
      <div className="shell">
        <p className="section-tag rv">03 — Skills</p>
        <h2 className="rv mt-4 text-4xl font-bold tracking-[-0.045em] md:text-5xl">
          Periodic <span className="heading-serif-end">table</span>
        </h2>
        <div className="mt-8 flex flex-wrap gap-2">
          <Chip active={filter === "All"} onClick={() => setFilter("All")}>
            All
          </Chip>
          {families.map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {visible.map((skill, idx) => {
              const row = Math.floor(idx / 8);
              const col = idx % 8;
              const dim = filter !== "All" && skill.family !== filter;
              return (
                <button
                  key={skill.slug}
                  type="button"
                  className={`card aspect-square p-2 text-left transition-opacity duration-300 ${
                    dim ? "opacity-25" : "opacity-100"
                  } ${active.slug === skill.slug ? "ring-2 ring-ink" : ""}`}
                  style={{
                    transitionDelay: `${(row + col) * 40}ms`,
                  }}
                  onClick={() => setActive(skill)}
                >
                  <span className="font-mono text-[10px] text-mute">{skill.atomic}</span>
                  <span className="mt-1 block text-lg font-bold">{skill.symbol}</span>
                  <span className="line-clamp-2 text-[10px] text-ink-2">{skill.name}</span>
                </button>
              );
            })}
          </div>
          <aside className="card sticky top-28 h-fit p-6">
            <p className="font-mono text-xs text-mute">{active.family}</p>
            <h3 className="mt-2 text-2xl font-bold">{active.name}</h3>
            <div className="mt-6 flex justify-center">
              <TechLogo slug={active.slug} name={active.name} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        active ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink"
      }`}
    >
      {children}
    </button>
  );
}
