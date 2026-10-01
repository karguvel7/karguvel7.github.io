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

/** Keep orbit off the pointer hotspot so clicks stay reliable. */
const ORBIT_CLEARANCE_PX = 118;

const FOLLOWERS: FollowerSpec[] = [
  {
    id: "chip-api",
    className: "cursor-object cursor-object-chip",
    accent: "cyan",
    label: "API",
    mass: 1.1,
    stiffness: 0.028,
    damping: 0.9,
    orbitRadius: 32,
    orbitSpeed: 0.72,
    phase: 0.6,
    size: 30,
  },
  {
    id: "chip-rag",
    className: "cursor-object cursor-object-chip",
    accent: "violet",
    label: "RAG",
    mass: 1.25,
    stiffness: 0.024,
    damping: 0.91,
    orbitRadius: 58,
    orbitSpeed: -0.58,
    phase: 2.4,
    size: 30,
  },
  {
    id: "chip-llm",
    className: "cursor-object cursor-object-chip",
    accent: "violet",
    label: "LLM",
    mass: 1.15,
    stiffness: 0.026,
    damping: 0.905,
    orbitRadius: 44,
    orbitSpeed: 0.88,
    phase: 4.1,
    size: 30,
  },
  {
    id: "node-agent",
    className: "cursor-object cursor-object-chip cursor-object-chip-ghost",
    accent: "blue",
    label: "Agent",
    mass: 1.35,
    stiffness: 0.022,
    damping: 0.912,
    orbitRadius: 86,
    orbitSpeed: 0.48,
    phase: 1.1,
    size: 32,
  },
  {
    id: "orbit-ring",
    className: "cursor-object cursor-object-ring",
    accent: "cyan",
    mass: 1.45,
    stiffness: 0.02,
    damping: 0.908,
    orbitRadius: 72,
    orbitSpeed: -0.42,
    phase: 3.6,
    size: 34,
  },
  {
    id: "node-diamond",
    className: "cursor-object cursor-object-diamond",
    accent: "blue",
    mass: 0.95,
    stiffness: 0.032,
    damping: 0.915,
    orbitRadius: 52,
    orbitSpeed: 0.95,
    phase: 5.2,
    size: 9,
  },
];

type BodyState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  el: HTMLDivElement;
};

const GRAVITY_STRENGTH = 0.0018;

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
      const dt = Math.min(28, now - last) / 16.667;
      last = now;
      timeRef.current += dt * 0.009;

      const { x: tx, y: ty } = targetRef.current;
      const root = document.documentElement;
      root.style.setProperty("--pointer-x", `${tx}px`);
      root.style.setProperty("--pointer-y", `${ty}px`);

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      root.style.setProperty("--grid-parallax-x", `${(tx - cx) * 0.005}px`);
      root.style.setProperty("--grid-parallax-y", `${(ty - cy) * 0.005}px`);

      FOLLOWERS.forEach((spec, index) => {
        const body = bodiesRef.current[index];
        if (!body?.el) return;

        const t = timeRef.current * spec.orbitSpeed + spec.phase;
        const orbit = ORBIT_CLEARANCE_PX + spec.orbitRadius;
        const anchorX = tx + Math.cos(t) * orbit;
        const anchorY = ty + Math.sin(t * 0.92) * orbit * 0.88;

        let ax = (anchorX - body.x) * spec.stiffness;
        let ay = (anchorY - body.y) * spec.stiffness;

        const gx = tx - body.x;
        const gy = ty - body.y;
        const dist = Math.hypot(gx, gy) || 1;
        if (dist > ORBIT_CLEARANCE_PX * 0.55) {
          const pull = (GRAVITY_STRENGTH * dist) / spec.mass;
          ax += (gx / dist) * pull * dist;
          ay += (gy / dist) * pull * dist;
        }

        body.vx = (body.vx + ax) * spec.damping;
        body.vy = (body.vy + ay) * spec.damping;
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
    <div
      ref={fieldRef}
      className="cursor-follow-field"
      aria-hidden="true"
      data-active="idle"
      inert
    >
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
