import { IdCard } from "@/components/id-card";
import { PROFILE } from "@/lib/data";

export function AboutSection() {
  return (
    <section id="about" className="section-pad border-t border-line">
      <div className="shell">
        <p className="section-tag rv" style={{ "--i": 0 } as React.CSSProperties}>
          02 — About
        </p>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px_1fr]">
          <div>
            <h2
              className="rv text-4xl font-bold tracking-[-0.045em] md:text-5xl"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              Hi, I&apos;m {PROFILE.name.split(" ")[0]}
              <span className="heading-serif-end">.</span>
            </h2>
            <p
              className="rv mt-6 text-ink-2 leading-relaxed"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              {PROFILE.summary}
            </p>
            <div
              className="rv mt-8 flex flex-wrap gap-3"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <a className="pill" href={PROFILE.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            </div>
          </div>
          <div className="rv" style={{ "--i": 2 } as React.CSSProperties}>
            <IdCard />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-mute">
              Quick facts
            </h3>
            <ul className="mt-4 space-y-3 text-ink-2">
              <li>
                <span className="text-mute">Location · </span>
                {PROFILE.location}
              </li>
              <li>
                <span className="text-mute">Education · </span>
                MCA, Anna University; BSc CS, Alagappa University (2010–2013)
              </li>
              <li>
                <span className="text-mute">Role · </span>
                {PROFILE.role}, {PROFILE.employer}
              </li>
              <li>
                <span className="text-mute">Email · </span>
                <a href={`mailto:${PROFILE.email}`} className="text-ink underline">
                  {PROFILE.email}
                </a>
              </li>
            </ul>
            <blockquote className="card mt-8 p-5 text-sm italic text-ink-2">
              “{PROFILE.quote}”
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
