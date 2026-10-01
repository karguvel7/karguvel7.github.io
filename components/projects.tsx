import { sectionAccent } from "@/lib/accents";
import { caseStudyFields, projects, type CaseStudy } from "@/lib/content";
import { InteractivePipeline } from "@/components/interactive-pipeline";
import { Section, SectionHeading } from "@/components/section";

export function Projects() {
  const accent = sectionAccent.projects;
  return (
    <Section id="projects" labelledBy="projects-heading" accent={accent}>
      <SectionHeading
        id="projects-heading"
        index="06"
        eyebrow="Featured projects"
        accent={accent}
        title="Systems architected and delivered."
        lede="Multi-agent orchestration, enterprise copilots, observability, and an AI-native way of building. Outcomes stay with what the work itself shows."
      />

      <div className="mt-12 divide-y divide-line border-y border-line">
        {projects.map((project, index) => (
          <CaseStudyArticle key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}

function CaseStudyArticle({ project, index }: { project: CaseStudy; index: number }) {
  return (
    <article
      id={project.id}
      aria-labelledby={`${project.id}-title`}
      data-accent={project.accent}
      className="interactive-panel py-6 sm:py-8"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <p className="font-mono text-[11px] text-faint">{String(index + 1).padStart(2, "0")}</p>
          <h3
            id={`${project.id}-title`}
            className="mt-3 text-2xl font-medium tracking-[-0.03em] text-balance text-ink"
          >
            {project.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
            {project.tags.map((tag) => (
              <li key={tag} data-accent={project.accent} className="tag-chip">
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-8">
          <InteractivePipeline stages={project.pipeline} accent={project.accent} />
          <dl className="mt-6 grid sm:grid-cols-2 sm:gap-x-8">
            {caseStudyFields.map((field) => (
              <div
                key={field.key}
                className={
                  field.key === "outcome"
                    ? "border-t border-line py-4 sm:col-span-2"
                    : "border-t border-line py-4"
                }
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                  {field.label}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{project[field.key]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  );
}
