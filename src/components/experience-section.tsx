"use client";

import { EXPERIENCE } from "@/lib/data";
import { useInView } from "@/hooks/useInView";

export function ExperienceSection() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section id="experience" className="section-pad border-t border-line">
      <div className="shell">
        <p className="section-tag rv">05 — Experience</p>
        <h2 className="rv mt-4 text-4xl font-bold tracking-[-0.045em] md:text-5xl">
          Timeline <span className="heading-serif-end">path</span>
        </h2>
        <div ref={ref} className="relative mt-12 pl-8">
          <div
            className="absolute bottom-0 left-[11px] top-0 w-px bg-line"
            aria-hidden
          />
          <div
            className="absolute left-[11px] top-0 w-px origin-top bg-ink transition-transform duration-1000 ease-[var(--ease)]"
            style={{ transform: `scaleY(${inView ? 1 : 0})`, height: "100%" }}
            aria-hidden
          />
          <ol className="space-y-8">
            {EXPERIENCE.map((item, i) => (
              <li
                key={`${item.title}-${item.start}`}
                className="relative rv"
                style={{ "--i": i } as React.CSSProperties}
              >
                <span
                  className={`absolute -left-8 top-1.5 h-3 w-3 rounded-full border-2 border-ink bg-card transition-colors ${
                    inView ? "bg-ink" : ""
                  }`}
                />
                <div className="card p-5">
                  <p className="font-mono text-xs text-mute">
                    {item.start}
                    {item.end ? ` — ${item.end}` : ""}
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-ink-2">
                    {item.org}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                  {item.detail && (
                    <p className="mt-2 text-sm text-ink-2">{item.detail}</p>
                  )}
                </div>
              </li>
            ))}
            <li className="relative">
              <div className="card border-dashed p-5 text-center">
                <p className="font-bold">Next — Your team?</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
