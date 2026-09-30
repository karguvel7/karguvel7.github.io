import { mailtoHref, site } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";

export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-heading">
      <SectionHeading
        id="contact-heading"
        index="10"
        eyebrow="Contact"
        title="A role, a freelance project, or a conversation."
        lede="Email is the fastest way to reach me. I typically reply within a couple of days."
      />

      <div className="mt-12 grid gap-10 border border-line p-5 sm:p-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <a
            href={mailtoHref()}
            className="break-words text-2xl font-medium tracking-[-0.03em] text-ink underline decoration-line underline-offset-4 hover:decoration-ink sm:text-3xl"
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
        <ul className="space-y-3 text-sm lg:col-span-5">
          <li>
            <a
              href={site.github}
              className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
              target="_blank"
              rel="me noopener noreferrer"
            >
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <span className="mt-1 block text-muted">github.com/{site.handle}</span>
          </li>
          <li>
            <a
              href={site.linkedin}
              className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
              target="_blank"
              rel="me noopener noreferrer"
            >
              LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <span className="mt-1 block text-muted">karguvel-k</span>
          </li>
        </ul>
      </div>
    </Section>
  );
}
