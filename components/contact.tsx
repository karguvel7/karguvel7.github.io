import { sectionAccent } from "@/lib/accents";
import { contactCta, mailtoHref, site } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";

export function Contact() {
  const accent = sectionAccent.contact;
  return (
    <Section id="contact" labelledBy="contact-heading" accent={accent}>
      <SectionHeading
        id="contact-heading"
        index="09"
        eyebrow="Contact"
        accent={accent}
        title={contactCta.headline}
        lede={contactCta.subline}
      />

      <div
        data-accent={accent}
        className="panel-accent-rail contact-cta mt-12 grid gap-10 p-5 sm:p-8 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Email</p>
          <a
            href={mailtoHref()}
            className="mt-3 break-words text-2xl font-medium tracking-[-0.03em] text-ink underline decoration-line underline-offset-4 hover:decoration-ink sm:text-3xl"
          >
            {site.email}
          </a>
          <p className="mt-4 text-sm text-muted">
            {site.location}
            <span className="px-2" aria-hidden="true">
              ·
            </span>
            {site.availability}
          </p>
        </div>
        <ul className="space-y-4 text-sm lg:col-span-5">
          <li>
            <a
              href={site.github}
              className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
              target="_blank"
              rel="me noopener noreferrer"
            >
              GitHub — github.com/{site.handle}
            </a>
          </li>
          <li>
            <a
              href={site.linkedin}
              className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
              target="_blank"
              rel="me noopener noreferrer"
            >
              LinkedIn — karguvel-k
            </a>
          </li>
        </ul>
      </div>
    </Section>
  );
}
