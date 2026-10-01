import type { ReactNode } from "react";
import type { Accent } from "@/lib/accents";
import { RevealOnView } from "@/components/reveal-on-view";

export function Section({
  id,
  labelledBy,
  accent = "neutral",
  children,
}: {
  id: string;
  labelledBy: string;
  accent?: Accent;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-accent={accent}
      className="section-shell border-t border-line/50 py-24 sm:py-28 lg:py-32"
    >
      <RevealOnView variant="blur-up" className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {children}
      </RevealOnView>
    </section>
  );
}

export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  lede,
  accent = "neutral",
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
  accent?: Accent;
}) {
  return (
    <div className="section-heading grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8" data-accent={accent}>
      <p className="section-heading-meta font-mono text-[11px] uppercase tracking-[0.16em] text-muted lg:col-span-3">
        <span className="section-heading-index text-muted">{index}</span>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        {eyebrow}
      </p>
      <div className="lg:col-span-9">
        <h2
          id={id}
          className="type-section-title max-w-3xl text-balance text-ink"
        >
          {title}
        </h2>
        <div className="section-title-accent mt-6" data-accent={accent} aria-hidden="true" />
        {lede ? (
          <p className="type-section-lede mt-6 max-w-2xl">{lede}</p>
        ) : null}
      </div>
    </div>
  );
}
