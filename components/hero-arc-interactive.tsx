"use client";

import { useCallback, useEffect, useState } from "react";
import { arc } from "@/lib/content";

export function HeroArcInteractive() {
  const [active, setActive] = useState(0);

  const activate = useCallback((index: number) => {
    setActive(index);
  }, []);

  useEffect(() => {
    if (document.documentElement.dataset.motion !== "on") return;

    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % arc.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="arc-grid mt-4 overflow-hidden border border-line bg-line">
      <div className="arc-flow" aria-hidden="true" />
      <div
        className="arc-progress"
        aria-hidden="true"
        style={{ width: `${((active + 1) / arc.length) * 100}%` }}
      />
      <ol className="relative grid gap-px sm:grid-cols-2 lg:grid-cols-5">
        {arc.map((item, index) => {
          const isActive = index === active;
          return (
            <li key={item.step} className="relative">
              <a
                href={item.href}
                data-accent={item.accent}
                className={`arc-cell block h-full border border-transparent bg-canvas px-4 py-4 transition-[transform,background,border-color,box-shadow] sm:last:col-span-2 lg:last:col-span-1 ${isActive ? "arc-cell-active" : ""}`}
                onPointerEnter={() => activate(index)}
                onFocus={() => activate(index)}
                aria-current={isActive ? "true" : undefined}
              >
                <p className="font-mono text-[11px] text-faint">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-3 text-sm font-medium text-ink">{item.step}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{item.detail}</p>
                <span className="arc-cell-link mt-3 inline-flex font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  Explore layer
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
