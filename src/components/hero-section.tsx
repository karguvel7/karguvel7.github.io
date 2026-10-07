import { HeroMedia } from "@/components/hero-media";
import { PROFILE } from "@/lib/data";

export function HeroSection() {
  return (
    <section id="hero" className="section-pad pt-28">
      <div className="shell grid items-end gap-10 lg:grid-cols-[1fr_auto]">
        <div className="order-2 lg:order-1 lg:pb-16">
          <p className="section-tag rv" style={{ "--i": 0 } as React.CSSProperties}>
            01 — Introduction
          </p>
          <h1
            className="rv mt-4 text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-none tracking-[-0.045em]"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            {PROFILE.role}
            <span className="heading-serif-end">.</span>
          </h1>
          <p
            className="rv mt-6 max-w-xl text-lg text-ink-2"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            {PROFILE.summary}
          </p>
          <div
            className="rv mt-8 flex flex-wrap gap-3"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            <a className="pill bg-ink text-paper" href="#work">
              Explore work
            </a>
            <a className="pill" href="#contact">
              Let&apos;s talk
            </a>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <HeroMedia />
        </div>
      </div>
    </section>
  );
}
