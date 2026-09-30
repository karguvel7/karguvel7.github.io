"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

export function MotionShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root.dataset.motion = "reduced";
      return;
    }

    root.dataset.motion = "on";

    const onMove = (event: PointerEvent) => {
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      <div className="pointer-spotlight" aria-hidden="true" />
      {children}
    </>
  );
}
