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
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
          <div className="lg:col-span-7">
            <p className="rise font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              {site.fullName}
              <span className="px-2" aria-hidden="true">
                ·
              </span>
              {site.location}
            </p>

            <RoleRibbon />

            <h1
              id="hero-heading"
              className="rise rise-delay-2 mt-7 max-w-4xl text-[2rem] font-medium leading-[1.12] tracking-[-0.035em] text-balance text-ink sm:text-[2.65rem] lg:text-[3.1rem]"
            >
              {site.headline}
            </h1>

            <p className="rise rise-delay-3 mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {site.heroSupport}
            </p>

            <div className="rise rise-delay-4 mt-7">
              <AvailabilityPill />
            </div>

            <div className="rise rise-delay-4 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <MagneticLink
                href="#projects"
                className="btn-primary btn-primary-accent inline-flex h-11 items-center justify-center px-5 text-sm font-medium hover:opacity-95"
              >
                View projects
              </MagneticLink>
              <MagneticLink
                href={site.github}
                className="btn-secondary btn-secondary-accent inline-flex h-11 items-center justify-center border border-line px-4 text-sm text-ink"
                target="_blank"
                rel="me noopener noreferrer"
              >
                GitHub
              </MagneticLink>
              <MagneticLink
                href={site.linkedin}
                className="btn-secondary btn-secondary-accent inline-flex h-11 items-center justify-center border border-line px-4 text-sm text-ink"
                target="_blank"
                rel="me noopener noreferrer"
              >
                LinkedIn
              </MagneticLink>
              <MagneticLink
                href={`mailto:${site.email}`}
                className="btn-secondary btn-secondary-accent inline-flex h-11 items-center justify-center border border-line px-4 text-sm text-ink"
              >
                Contact
              </MagneticLink>
            </div>

            <p className="rise rise-delay-4 mt-5 text-sm text-muted">
              {site.jobTitle} at {site.employer}
              <span className="px-2 text-faint" aria-hidden="true">
                ·
              </span>
              since February 2017
            </p>

            <HeroAgentViz />
          </div>

          <div className="rise rise-delay-2 mt-10 lg:col-span-5 lg:mt-2">
            <div className="hero-portrait-wrap mx-auto max-w-[19rem] sm:max-w-xs lg:ml-auto lg:max-w-sm">
              <ProfilePhoto priority sizes="(max-width: 640px) 19rem, 22rem" />
            </div>
          </div>
        </div>

        <div className="mt-14 lg:mt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            How the work is shaped
          </p>
          <HeroArcInteractive />
        </div>
      </div>
    </section>
  );
}
