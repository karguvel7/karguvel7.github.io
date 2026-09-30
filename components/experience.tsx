import { experience } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";

export function Experience() {
  return (
    <Section id="experience" labelledBy="experience-heading">
      <SectionHeading
        id="experience-heading"
        index="02"
        eyebrow="Professional experience"
        title={`${experience.title} at ${experience.employer}`}
        lede={experience.lede}
      />

      <article className="mt-12 border border-line p-5 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">{experience.title}</h3>
            <p className="mt-1 text-sm text-muted">{experience.employer}</p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
            {experience.dates}
            <span className="px-2" aria-hidden="true">
              ·
            </span>
            {experience.tenure}
          </p>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{experience.continuity}</p>

        <ul className="mt-8 max-w-3xl space-y-3">
          {experience.scope.map((item) => (
            <li key={item} className="border-t border-line pt-3 text-sm leading-relaxed text-muted">
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              Domain expertise
            </h3>
            <ul className="mt-4 space-y-2">
              {experience.domains.map((domain) => (
                <li key={domain} className="text-sm text-ink">
                  {domain}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              Industries served
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Industries served">
              {experience.industries.map((industry) => (
                <li
                  key={industry}
                  className="border border-line px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted"
                >
                  {industry}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>

      <div id="education" className="mt-10 scroll-mt-24">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Education</h3>
        <dl className="mt-4 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          {experience.education.map((item) => (
            <div key={item.credential} className="bg-canvas p-5">
              <dt className="text-sm font-medium text-ink">{item.credential}</dt>
              <dd className="mt-1 text-sm text-muted">{item.school}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
