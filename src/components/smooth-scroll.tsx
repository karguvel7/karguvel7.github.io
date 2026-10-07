"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { setLenis } from "@/lib/scroll";
import { usePrefersReducedMotion } from "@/hooks/prefersReducedMotion";

export function SmoothScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setLenis(lenis);
    document.documentElement.classList.add("lenis");

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
      document.documentElement.classList.remove("lenis");
    };
  }, [reduced]);

  return null;
}
