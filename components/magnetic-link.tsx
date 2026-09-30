"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useRef } from "react";

type MagneticLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  strength?: number;
};

export function MagneticLink({
  children,
  className = "",
  strength = 0.22,
  ...props
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (document.documentElement.dataset.motion !== "on") return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    node.style.setProperty("--magnet-x", `${x * strength}px`);
    node.style.setProperty("--magnet-y", `${y * strength}px`);
  };

  const onLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--magnet-x", "0px");
    node.style.setProperty("--magnet-y", "0px");
  };

  return (
    <a
      ref={ref}
      className={`magnetic-link ${className}`.trim()}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...props}
    >
      {children}
    </a>
  );
}
