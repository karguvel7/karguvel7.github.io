import { site } from "@/lib/content";
import { HeroArcInteractive } from "@/components/hero-arc-interactive";
import { MagneticLink } from "@/components/magnetic-link";
import { ProfilePhoto } from "@/components/profile-photo";
import { RoleRibbon } from "@/components/role-ribbon";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-14">
          <div className="lg:col-span-7">
            <p className="rise font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              {site.name}
              <span className="px-2" aria-hidden="true">
                ·
              </span>
              {site.location}
            </p>

            <RoleRibbon />

            <h1
              id="hero-heading"
              className="rise rise-delay-2 mt-8 max-w-4xl text-[2.05rem] font-medium leading-[1.15] tracking-[-0.035em] text-balance text-ink sm:text-5xl sm:leading-[1.08] lg:text-[3.35rem]"
            >
              {site.headline}
            </h1>

            <p className="rise rise-delay-3 mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {site.summary}
            </p>

            <div className="rise rise-delay-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <MagneticLink
                href="#projects"
                className="btn-primary btn-primary-accent inline-flex h-11 items-center justify-center px-4 text-sm font-medium hover:opacity-95"
              >
                View the work
              </MagneticLink>
              <MagneticLink
                href={`mailto:${site.email}`}
                className="btn-secondary btn-secondary-accent inline-flex h-11 items-center justify-center border border-line px-4 text-sm text-ink"
              >
                {site.email}
              </MagneticLink>
            </div>

            <p className="rise rise-delay-4 mt-5 text-sm text-muted">
              {site.jobTitle} at {site.employer}
              <span className="px-2 text-faint" aria-hidden="true">
                ·
              </span>
              since February 2017
            </p>
            <p className="mt-2 text-sm text-faint">
              {site.availability}
              <span className="px-2" aria-hidden="true">
                ·
              </span>
              {site.rolesNote}
            </p>
          </div>

          <div className="rise rise-delay-2 mt-12 lg:col-span-5 lg:mt-4 xl:mt-0">
            <div className="mx-auto max-w-[17rem] sm:max-w-xs lg:ml-auto lg:max-w-sm">
              <ProfilePhoto priority sizes="(max-width: 640px) 17rem, 20rem" />
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
