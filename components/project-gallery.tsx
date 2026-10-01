"use client";

import { useMemo, useState } from "react";
import { sectionAccent } from "@/lib/accents";
import {
  caseStudyFields,
  projectCategories,
  projects,
  type CaseStudy,
  type ProjectCategory,
} from "@/lib/content";
import { InteractivePipeline } from "@/components/interactive-pipeline";
import { Section, SectionHeading } from "@/components/section";

export function ProjectGallery() {
  const accent = sectionAccent.projects;
  const [filter, setFilter] = useState<ProjectCategory>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((p) => p.categories.includes(filter));
  }, [filter]);

  return (
    <Section id="projects" labelledBy="projects-heading" accent={accent}>
      <SectionHeading
        id="projects-heading"
        index="05"
        eyebrow="Featured projects"
        accent={accent}
        title="Production systems, documented end to end."
        lede="Multi-agent orchestration, enterprise copilots, observability, and AI-native delivery. Filter by layer — outcomes stay with what each case study describes."
      />

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Project categories">
        {projectCategories.map((category) => {
          const selected = filter === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selected}
              data-accent={category === "All" ? "neutral" : category === "AI" ? "violet" : "cyan"}
              className={`project-filter ${selected ? "is-active" : ""}`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-10 space-y-6">
        {filtered.map((project, index) => (
          <CaseStudyCard key={project.id} project={project} index={index} />
        ))}
        {filtered.length === 0 ? (
          <p className="text-sm text-muted">No projects in this category yet.</p>
        ) : null}
      </div>
    </Section>
  );
}

function CaseStudyCard({ project, index }: { project: CaseStudy; index: number }) {
  return (
    <article
      id={project.id}
      data-accent={project.accent}
      aria-labelledby={`${project.id}-title`}
      className="project-card glass-panel scroll-mt-24 p-5 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] text-faint">{String(index + 1).padStart(2, "0")}</p>
          <h3
            id={`${project.id}-title`}
            className="mt-2 text-2xl font-medium tracking-[-0.03em] text-balance text-ink"
          >
            {project.title}
          </h3>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="Categories">
          {project.categories.map((cat) => (
            <li key={cat} data-accent={project.accent} className="tag-chip">
              {cat}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">{project.summary}</p>

      <div className="mt-6">
        <InteractivePipeline stages={project.pipeline} accent={project.accent} />
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {caseStudyFields.map((field) => (
          <div
            key={field.key}
            className={field.key === "outcome" ? "sm:col-span-2 border-t border-line pt-4" : "border-t border-line pt-4"}
          >
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">{field.label}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted">{project[field.key]}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
