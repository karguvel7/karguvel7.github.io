import type { ReactNode } from "react";
import { RevealOnView } from "@/components/reveal-on-view";

export function Section({
  id,
  labelledBy,
  children,
}: {
  id: string;
  labelledBy: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className="scroll-mt-20 border-t border-line py-20 sm:py-28"
    >
      <RevealOnView className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</RevealOnView>
    </section>
  );
}

export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  lede,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint lg:col-span-3">
        <span className="text-muted">{index}</span>
        <span className="px-2" aria-hidden="true">
          /
        </span>
        {eyebrow}
      </p>
      <div className="lg:col-span-9">
        <h2
          id={id}
          className="max-w-3xl text-3xl font-medium tracking-[-0.03em] text-balance text-ink sm:text-4xl"
        >
          {title}
        </h2>
        {lede ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{lede}</p>
        ) : null}
      </div>
    </div>
  );
}
