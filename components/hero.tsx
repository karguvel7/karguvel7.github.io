import { arc, roles, site } from "@/lib/content";
import { ProfilePhoto } from "@/components/profile-photo";

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

            <ul className="rise rise-delay-1 mt-6 flex flex-wrap gap-x-3 gap-y-2 text-sm text-muted">
              {roles.map((role, index) => (
                <li key={role} className="flex items-center gap-3">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-faint">
                      /
                    </span>
                  ) : null}
                  <span>{role}</span>
                </li>
              ))}
            </ul>

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
              <a
                href="#projects"
                className="btn-primary inline-flex h-11 items-center justify-center bg-ink px-4 text-sm font-medium text-canvas hover:opacity-90"
              >
                View the work
              </a>
              <a
                href={`mailto:${site.email}`}
                className="btn-secondary inline-flex h-11 items-center justify-center border border-line px-4 text-sm text-ink"
              >
                {site.email}
              </a>
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
          <div className="arc-grid mt-4 overflow-hidden border border-line bg-line">
            <div className="arc-flow" aria-hidden="true" />
            <ol className="relative grid gap-px sm:grid-cols-2 lg:grid-cols-5">
              {arc.map((item, index) => (
                <li
                  key={item.step}
                  className="arc-cell border border-transparent bg-canvas px-4 py-4 sm:last:col-span-2 lg:last:col-span-1"
                >
                  <p className="font-mono text-[11px] text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-sm font-medium text-ink">{item.step}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{item.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
