import { sectionAccent } from "@/lib/accents";
import { site } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";

export function GithubSection() {
  const accent = sectionAccent.github;
  return (
    <Section id="github" labelledBy="github-heading" accent={accent}>
      <SectionHeading
        id="github-heading"
        index="09"
        eyebrow="GitHub"
        accent={accent}
        title="Public code lives on the profile."
        lede="Case studies above are the write-up of the work. The GitHub link is the profile itself — no per-project repository URLs, star counts, or contribution graph."
      />

      <div className="panel-accent-rail mt-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Profile</p>
          <a
            href={site.github}
            className="mt-2 block text-lg text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
            target="_blank"
            rel="me noopener noreferrer"
          >
            github.com/{site.handle}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <a
          href={site.github}
          className="btn-secondary btn-secondary-accent inline-flex h-11 items-center justify-center border border-line px-4 text-sm text-ink"
          target="_blank"
          rel="me noopener noreferrer"
        >
          Open GitHub
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </Section>
  );
}
