import { site } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {site.name}
          <span className="text-faint"> · Chennai</span>
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          <a
            href={site.github}
            className="hover:text-ink"
            target="_blank"
            rel="me noopener noreferrer"
          >
            GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a
            href={site.linkedin}
            className="hover:text-ink"
            target="_blank"
            rel="me noopener noreferrer"
          >
            LinkedIn
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={`mailto:${site.email}`} className="hover:text-ink">
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
