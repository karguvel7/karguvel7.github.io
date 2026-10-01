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

      <ul
        className="about-highlights mt-10 grid auto-rows-fr grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-5 lg:gap-4"
      >
        {about.highlights.map((item, index) => (
          <li key={item.label} className="h-full">
            <article
              data-accent={accent}
              className="about-stat stat-card diagram-surface flex h-full min-h-[9.5rem] flex-col p-0"
            >
              <div className="about-stat-head flex items-start justify-between gap-2 border-b border-line/50 px-5 py-3.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{item.label}</p>
                <span className="about-stat-seq font-mono text-[11px] tabular-nums text-faint" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col px-5 py-4">
                <p className="text-lg font-medium tracking-tight text-ink">{item.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted">{item.detail}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-5 lg:col-span-7">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} className="max-w-2xl text-base leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
          <p className="max-w-2xl text-base leading-relaxed text-muted">{about.applicationStack}</p>
        </div>

        <dl data-accent={accent} className="about-facts diagram-surface flex flex-col p-0 lg:col-span-5">
          <div className="border-b border-line/50 px-5 py-4">
            <dt className="sr-only">Profile facts</dt>
            <dd className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">At a glance</dd>
          </div>
          {about.facts.map((fact) => (
            <div key={fact.label} className="about-fact-row border-b border-line/45 px-5 py-4 last:border-b-0">
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{fact.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
