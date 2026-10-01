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

    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const setPointerMode = () => {
      root.dataset.pointer = coarseQuery.matches ? "coarse" : "fine";
    };
    setPointerMode();
    coarseQuery.addEventListener("change", setPointerMode);

    if (coarseQuery.matches) {
      return () => coarseQuery.removeEventListener("change", setPointerMode);
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.22;
    let smoothX = targetX;
    let smoothY = targetY;
    let auroraX = targetX;
    let auroraY = targetY;
    let rafId = 0;

    const writeSmoothVars = () => {
      smoothX += (targetX - smoothX) * 0.11;
      smoothY += (targetY - smoothY) * 0.11;
      auroraX += (targetX - auroraX) * 0.055;
      auroraY += (targetY - auroraY) * 0.055;

      root.style.setProperty("--cursor-x", `${targetX}px`);
      root.style.setProperty("--cursor-y", `${targetY}px`);
      root.style.setProperty("--pointer-x", `${smoothX}px`);
      root.style.setProperty("--pointer-y", `${smoothY}px`);
      root.style.setProperty("--aurora-x", `${auroraX}px`);
      root.style.setProperty("--aurora-y", `${auroraY}px`);

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      root.style.setProperty("--grid-parallax-x", `${(smoothX - cx) * 0.016}px`);
      root.style.setProperty("--grid-parallax-y", `${(smoothY - cy) * 0.016}px`);
      root.style.setProperty("--dust-parallax-x", `${(smoothX - cx) * 0.028}px`);
      root.style.setProperty("--dust-parallax-y", `${(smoothY - cy) * 0.028}px`);

      rafId = requestAnimationFrame(writeSmoothVars);
    };

    let moveScheduled = false;
    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (moveScheduled) return;
      moveScheduled = true;
      requestAnimationFrame(() => {
        moveScheduled = false;
      });
    };

    rafId = requestAnimationFrame(writeSmoothVars);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      coarseQuery.removeEventListener("change", setPointerMode);
    };
  }, []);

  return (
    <>
      <div className="pointer-spotlight" aria-hidden="true" />
      <div className="pointer-aurora" aria-hidden="true" />
      <div className="cursor-parallax-dust" aria-hidden="true" />
      {children}
    </>
  );
}
