import { sectionAccent } from "@/lib/accents";
import { engineeringLab, site } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";

export function EngineeringLab() {
  const accent = sectionAccent.lab;
  return (
    <Section id="lab" labelledBy="lab-heading" accent={accent}>
      <SectionHeading
        id="lab-heading"
        index="07"
        eyebrow="Engineering lab"
        accent={accent}
        title="Experiments that feed production work."
        lede={engineeringLab.lede}
      />

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {engineeringLab.items.map((item) => (
          <li key={item.title}>
            <a href={item.href} data-accent="violet" className="lab-card diagram-surface block p-6 sm:p-7">
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} data-accent="violet" className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="mt-4 text-lg font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.detail}</p>
              <span className="mt-4 inline-flex font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                View case study →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-muted">{engineeringLab.note}</p>
      <p className="mt-4 text-sm text-muted">
        Public code:{" "}
        <a
          href={site.github}
          className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
          target="_blank"
          rel="me noopener noreferrer"
        >
          github.com/{site.handle}
        </a>
      </p>
    </Section>
  );
}
