import { sectionAccent } from "@/lib/accents";
import { about } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";

export function About() {
  const accent = sectionAccent.about;
  return (
    <Section id="about" labelledBy="about-heading" accent={accent}>
      <SectionHeading
        id="about-heading"
        index="01"
        eyebrow="About"
        accent={accent}
        title="Engineering production AI, cloud, and enterprise systems."
        lede={about.lede}
      />

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {about.highlights.map((item) => (
          <li key={item.label} data-accent={accent} className="stat-card diagram-surface p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{item.label}</p>
            <p className="mt-2 text-lg font-medium text-ink">{item.value}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{item.detail}</p>
          </li>
        ))}
      </ul>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-5 lg:col-span-7">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} className="max-w-2xl text-base leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
          <p className="max-w-2xl text-base leading-relaxed text-muted">{about.applicationStack}</p>
        </div>

        <dl
          data-accent={accent}
          className="panel-accent-rail border-t border-line lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-8"
        >
          {about.facts.map((fact) => (
            <div key={fact.label} className="border-b border-line py-4">
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                {fact.label}
              </dt>
              <dd className="mt-2 text-sm text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
