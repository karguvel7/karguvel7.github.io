"use client";

import type { ReactNode } from "react";
import { RevealOnView } from "@/components/reveal-on-view";

export function RevealStagger({
  children,
  className = "",
  asGrid = false,
}: {
  children: ReactNode;
  className?: string;
  asGrid?: boolean;
}) {
  return (
    <RevealOnView
      variant="blur-up"
      className={`reveal-stagger ${asGrid ? "reveal-stagger-grid" : ""} ${className}`.trim()}
    >
      {children}
    </RevealOnView>
  );
}
