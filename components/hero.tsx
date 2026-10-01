import { site } from "@/lib/content";
import { AvailabilityPill } from "@/components/availability-pill";
import { HeroAgentViz } from "@/components/hero-agent-viz";
import { HeroArcInteractive } from "@/components/hero-arc-interactive";
import { MagneticLink } from "@/components/magnetic-link";
import { ProfilePhoto } from "@/components/profile-photo";
import { RoleRibbon } from "@/components/role-ribbon";

export function Hero() {
  return (
    <section id="top" className="hero-shell relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="hero-aurora" aria-hidden="true" />
      <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28 lg:pt-32">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12 xl:gap-14">
          <div className="lg:col-span-7">
            <p className="rise hero-eyebrow font-mono text-[11px] uppercase tracking-[0.2em]">
              {site.fullName}
              <span className="px-2" aria-hidden="true">
                ·
              </span>
              {site.location}
            </p>

            <RoleRibbon />

            <h1 id="hero-heading" className="rise rise-delay-2 type-display mt-8 max-w-4xl text-balance text-ink">
              {site.headline}
            </h1>

            <p className="rise rise-delay-3 type-hero-lede mt-6 max-w-2xl">
              {site.heroSupport}
            </p>

            <div className="rise rise-delay-4 mt-8">
              <AvailabilityPill />
            </div>

            <div className="rise rise-delay-4 hero-cta-row mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <MagneticLink
                href="#projects"
                className="btn-primary btn-primary-accent btn-lift inline-flex h-12 items-center justify-center px-6 text-sm font-medium"
              >
                View projects
              </MagneticLink>
              <MagneticLink
                href={site.github}
                className="btn-secondary btn-secondary-accent btn-lift inline-flex h-12 items-center justify-center border px-5 text-sm text-ink"
                target="_blank"
                rel="me noopener noreferrer"
              >
                GitHub
              </MagneticLink>
              <MagneticLink
                href={site.linkedin}
                className="btn-secondary btn-secondary-accent btn-lift inline-flex h-12 items-center justify-center border px-5 text-sm text-ink"
                target="_blank"
                rel="me noopener noreferrer"
              >
                LinkedIn
              </MagneticLink>
              <MagneticLink
                href={`mailto:${site.email}`}
                className="btn-secondary btn-secondary-accent btn-lift inline-flex h-12 items-center justify-center border px-5 text-sm text-ink"
              >
                Contact
              </MagneticLink>
            </div>

            <p className="rise rise-delay-4 mt-6 text-sm text-muted">
              {site.jobTitle} at {site.employer}
              <span className="px-2 text-faint" aria-hidden="true">
                ·
              </span>
              since February 2017
            </p>

            <HeroAgentViz />
          </div>

          <div className="rise rise-delay-2 mt-14 lg:col-span-5 lg:mt-4 xl:mt-0">
            <div className="hero-portrait-wrap mx-auto max-w-[20rem] sm:max-w-xs lg:ml-auto lg:max-w-sm">
              <div className="portrait-halo" aria-hidden="true" />
              <ProfilePhoto priority sizes="(max-width: 640px) 20rem, 22rem" />
            </div>
          </div>
        </div>

        <div className="mt-16 lg:mt-20">
          <div className="mb-4 flex items-end justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              How the work is shaped
            </p>
            <span className="diagram-status hidden sm:inline-flex" data-accent="cyan">
              Layer map
            </span>
          </div>
          <div className="diagram-surface diagram-surface-flush p-1 sm:p-1.5">
            <HeroArcInteractive />
          </div>
        </div>
      </div>
    </section>
  );
}
