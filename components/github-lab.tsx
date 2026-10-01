"use client";

import { useEffect, useState } from "react";
import { sectionAccent } from "@/lib/accents";
import { site } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";

type Repo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  updated_at: string;
};

export function GithubLab() {
  const accent = sectionAccent.github;
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${site.handle}/repos?sort=updated&per_page=6`,
          { headers: { Accept: "application/vnd.github+json" } },
        );
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);
        const data = (await response.json()) as Repo[];
        if (!cancelled) setRepos(data);
      } catch {
        if (!cancelled) setError("Could not load repositories right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section id="github" labelledBy="github-heading" accent={accent}>
      <SectionHeading
        id="github-heading"
        index="08"
        eyebrow="GitHub"
        accent={accent}
        title="Active engineering on the profile."
        lede="Case studies above are the narrative. GitHub is the lab — recent public repositories when the API is available, otherwise the profile link."
      />

      <div className="glass-panel mt-10 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Profile</p>
            <a
              href={site.github}
              className="mt-2 block text-lg text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
              target="_blank"
              rel="me noopener noreferrer"
            >
              github.com/{site.handle}
            </a>
          </div>
          <a
            href={site.github}
            className="btn-secondary btn-secondary-accent inline-flex h-11 items-center justify-center border border-line px-4 text-sm text-ink"
            target="_blank"
            rel="me noopener noreferrer"
          >
            Open GitHub
          </a>
        </div>

        <div className="mt-8 border-t border-line pt-6">
          {loading ? (
            <p className="text-sm text-muted" aria-live="polite">
              Loading recent repositories…
            </p>
          ) : null}
          {error ? (
            <p className="text-sm text-muted" role="status">
              {error}{" "}
              <a href={site.github} className="text-ink underline underline-offset-4">
                Visit the profile
              </a>
              .
            </p>
          ) : null}
          {repos && repos.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {repos.map((repo) => (
                <li key={repo.name}>
                  <a
                    href={repo.html_url}
                    data-accent="cyan"
                    className="lab-card block rounded-sm border border-line p-4 transition-colors hover:border-faint"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="font-medium text-ink">{repo.name}</span>
                    {repo.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-muted">{repo.description}</p>
                    ) : (
                      <p className="mt-2 text-sm text-faint">No description</p>
                    )}
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                      {repo.language ?? "—"}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {repos && repos.length === 0 && !error ? (
            <p className="text-sm text-muted">No public repositories listed.</p>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
