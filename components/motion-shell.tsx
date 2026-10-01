"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { CursorFollowField } from "@/components/cursor-follow-field";
import { ScrollChoreographer } from "@/components/scroll-choreographer";

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

    return () => coarseQuery.removeEventListener("change", setPointerMode);
  }, []);

  return (
    <>
      <CursorFollowField />
      <ScrollChoreographer />
      {children}
    </>
  );
}
