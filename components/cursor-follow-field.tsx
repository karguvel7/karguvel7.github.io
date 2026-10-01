"use client";

import { useEffect, useRef } from "react";

type Accent = "blue" | "violet" | "cyan";

type FollowerSpec = {
  id: string;
  className: string;
  accent: Accent;
  label?: string;
  mass: number;
  stiffness: number;
  damping: number;
  orbitRadius: number;
  orbitSpeed: number;
  phase: number;
  size: number;
};

/** Tech tokens already used on the site (skills / case studies) — decorative cursor chrome only. */
const FOLLOWERS: FollowerSpec[] = [
  {
    id: "core-node",
    className: "cursor-object cursor-object-node cursor-object-node-core",
    accent: "blue",
    mass: 0.9,
    stiffness: 0.072,
    damping: 0.84,
    orbitRadius: 0,
    orbitSpeed: 0,
    phase: 0,
    size: 34,
  },
  {
    id: "chip-api",
    className: "cursor-object cursor-object-chip",
    accent: "cyan",
    label: "API",
    mass: 0.42,
    stiffness: 0.058,
    damping: 0.83,
    orbitRadius: 72,
    orbitSpeed: 1.05,
    phase: 0.6,
    size: 44,
  },
  {
    id: "chip-rag",
    className: "cursor-object cursor-object-chip",
    accent: "violet",
    label: "RAG",
    mass: 0.38,
    stiffness: 0.054,
    damping: 0.82,
    orbitRadius: 98,
    orbitSpeed: -0.88,
    phase: 2.4,
    size: 42,
  },
  {
    id: "chip-llm",
    className: "cursor-object cursor-object-chip cursor-object-chip-wide",
    accent: "violet",
    label: "LLM",
    mass: 0.4,
    stiffness: 0.06,
    damping: 0.84,
    orbitRadius: 58,
    orbitSpeed: 1.35,
    phase: 4.1,
    size: 46,
  },
  {
    id: "node-agent",
    className: "cursor-object cursor-object-chip cursor-object-chip-ghost",
    accent: "blue",
    label: "Agent",
    mass: 0.36,
    stiffness: 0.065,
    damping: 0.85,
    orbitRadius: 124,
    orbitSpeed: 0.72,
    phase: 1.1,
    size: 50,
  },
  {
    id: "orbit-ring",
    className: "cursor-object cursor-object-ring",
    accent: "cyan",
    mass: 0.55,
    stiffness: 0.042,
    damping: 0.78,
    orbitRadius: 108,
    orbitSpeed: -0.58,
    phase: 3.6,
    size: 52,
  },
  {
    id: "node-diamond",
    className: "cursor-object cursor-object-diamond",
    accent: "blue",
    mass: 0.32,
    stiffness: 0.068,
    damping: 0.86,
    orbitRadius: 86,
    orbitSpeed: 1.55,
    phase: 5.2,
    size: 16,
  },
  {
    id: "trail-orb",
    className: "cursor-object cursor-object-node cursor-object-node-trail",
    accent: "violet",
    mass: 0.48,
    stiffness: 0.046,
    damping: 0.79,
    orbitRadius: 46,
    orbitSpeed: -1.15,
    phase: 2.9,
    size: 22,
  },
];

type BodyState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  el: HTMLDivElement;
};

export function CursorFollowField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const bodiesRef = useRef<BodyState[]>([]);
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const nodes = field.querySelectorAll<HTMLDivElement>("[data-cursor-object]");
    bodiesRef.current = FOLLOWERS.map((spec, index) => {
      const el = nodes[index];
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 3;
      return { x, y, vx: 0, vy: 0, el };
    });

    targetRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 3 };

    const onMove = (event: PointerEvent) => {
      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;
      field.dataset.active = "true";
    };

    const onLeave = () => {
      field.dataset.active = "idle";
    };

    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16.667;
      last = now;
      timeRef.current += dt * 0.018;

      const { x: tx, y: ty } = targetRef.current;
      const root = document.documentElement;
      root.style.setProperty("--pointer-x", `${tx}px`);
      root.style.setProperty("--pointer-y", `${ty}px`);

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      root.style.setProperty("--grid-parallax-x", `${(tx - cx) * 0.01}px`);
      root.style.setProperty("--grid-parallax-y", `${(ty - cy) * 0.01}px`);

      FOLLOWERS.forEach((spec, index) => {
        const body = bodiesRef.current[index];
        if (!body?.el) return;

        const t = timeRef.current * spec.orbitSpeed + spec.phase;
        const anchorX = tx + Math.cos(t) * spec.orbitRadius;
        const anchorY = ty + Math.sin(t * 0.94) * spec.orbitRadius * 0.9;

        const ax = (anchorX - body.x) * spec.stiffness;
        const ay = (anchorY - body.y) * spec.stiffness;
        body.vx = (body.vx + ax / spec.mass) * spec.damping;
        body.vy = (body.vy + ay / spec.mass) * spec.damping;
        body.x += body.vx * dt;
        body.y += body.vy * dt;

        const half = spec.size / 2;
        body.el.style.transform = `translate3d(${body.x - half}px, ${body.y - half}px, 0)`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={fieldRef} className="cursor-follow-field" aria-hidden="true" data-active="idle">
      {FOLLOWERS.map((spec) => (
        <div
          key={spec.id}
          data-cursor-object
          data-accent={spec.accent}
          className={spec.className}
          style={{ width: spec.size, height: spec.size }}
        >
          {spec.label ? (
            <span className="cursor-object-label font-mono">{spec.label}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
