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
import { RevealOnView } from "@/components/reveal-on-view";
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

      <div className="mt-12 flex flex-wrap gap-2 sm:gap-2.5" role="tablist" aria-label="Project categories">
        {projectCategories.map((category) => {
          const selected = filter === category;
          const chipAccent =
            category === "All"
              ? "neutral"
              : category === "AI" || category === "Automation"
                ? "violet"
                : category === "DevOps"
                  ? "amber"
                  : category === "Cloud"
                    ? "cyan"
                    : "emerald";
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selected}
              data-accent={chipAccent}
              className={`project-filter ${selected ? "is-active" : ""}`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="projects-stage mt-12 space-y-10 sm:space-y-12" key={filter}>
        {filtered.map((project, index) => (
          <RevealOnView key={project.id} variant="blur-up" delayMs={index * 90}>
            <CaseStudyCard
              project={project}
              displayIndex={projects.findIndex((p) => p.id === project.id)}
            />
          </RevealOnView>
        ))}
        {filtered.length === 0 ? (
          <p className="text-sm text-muted">No projects in this category yet.</p>
        ) : null}
      </div>
    </Section>
  );
}

function CaseStudyCard({
  project,
  displayIndex,
}: {
  project: CaseStudy;
  displayIndex: number;
}) {
  const sequence = String(displayIndex + 1).padStart(2, "0");

  return (
    <article
      id={project.id}
      data-accent={project.accent}
      aria-labelledby={`${project.id}-title`}
      className="project-card project-showcase diagram-surface scroll-mt-24 p-6 sm:p-10"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-5 sm:gap-8">
          <p className="project-showcase-index shrink-0" aria-hidden="true">
            {sequence}
          </p>
          <div className="min-w-0 flex-1">
            <ul className="flex flex-wrap gap-2" aria-label="Categories">
              {project.categories.map((cat) => (
                <li key={cat} data-accent={project.accent} className="tag-chip">
                  {cat}
                </li>
              ))}
            </ul>
            <h3
              id={`${project.id}-title`}
              className="project-showcase-title mt-4 text-balance font-display text-2xl font-semibold tracking-[-0.035em] text-ink sm:text-[1.75rem]"
            >
              {project.title}
            </h3>
          </div>
        </div>
      </div>

      <p className="project-showcase-summary mt-6 max-w-3xl text-muted">{project.summary}</p>

      <div className="mt-8">
        <InteractivePipeline stages={project.pipeline} accent={project.accent} />
      </div>

      <details className="case-study-details mt-8">
        <summary>Explore case study</summary>
        <dl className="grid gap-6 pb-2 pt-2 sm:grid-cols-2">
          {caseStudyFields.map((field) => (
            <div
              key={field.key}
              className={
                field.key === "outcome"
                  ? "sm:col-span-2 border-t border-line/80 pt-5"
                  : "border-t border-line/80 pt-5"
              }
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{field.label}</dt>
              <dd className="mt-2.5 text-sm leading-relaxed text-muted">{project[field.key]}</dd>
            </div>
          ))}
        </dl>
      </details>
    </article>
  );
}
