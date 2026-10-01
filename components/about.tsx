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
        title="Design, build, deploy, and operate production AI systems."
        lede={about.lede}
      />

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
