import { platformAreaAccents, sectionAccent } from "@/lib/accents";
import { platformAreas } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";

export function Platform() {
  const accent = sectionAccent.platform;
  return (
    <Section id="platform" labelledBy="platform-heading" accent={accent}>
      <SectionHeading
        id="platform-heading"
        index="05"
        eyebrow="DevOps and cloud"
        accent={accent}
        title="The platform the AI systems run on."
        lede="Deployment, delivery, and operability are part of the same job as the agent layer — AWS, Azure, containers, pipelines, and the signals that tell you the system is healthy."
      />

      <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
        {platformAreas.map((area, index) => {
          const tileAccent = platformAreaAccents[index] ?? "cyan";
          return (
            <article
              key={area.title}
              data-accent={tileAccent}
              className="platform-tile bg-canvas p-5 sm:p-6"
            >
              <h3 className="text-base font-medium text-ink">{area.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label={area.title}>
                {area.items.map((item) => (
                  <li key={item} data-accent={tileAccent} className="tag-chip">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-muted">{area.note}</p>
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-muted">
        See{" "}
        <a href="#trade-finance-ai-copilot" className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
          Trade Finance AI Copilot
        </a>{" "}
        for Azure and observability on an enterprise workflow, and{" "}
        <a href="#enterprise-observability" className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
          Enterprise Observability Platform
        </a>{" "}
        for tracking, audit, sharding, and Docker.
      </p>
    </Section>
  );
}
