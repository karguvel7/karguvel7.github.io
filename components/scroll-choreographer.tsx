"use client";

import { useEffect, useRef } from "react";

const NODE_SELECTOR =
  ".diagram-surface, .panel-accent-rail, .lab-card, .platform-tile, .timeline-item, .project-showcase, .skill-card";
const MAX_DEPTH = 4;
const NODE_SETTLE_MS = 2100;
const SCENE_SETTLE_MS = 2600;
const HEADING_LEAD_MS = 560;
const STAGGER_MS = 110;

type TraceKind = "node" | "type";

function collectTargets(el: Element, depth: number, out: Array<[HTMLElement, TraceKind]>) {
  if (!(el instanceof HTMLElement) || el.getAttribute("aria-hidden") === "true") return;
  const hasNodeInside = el.querySelector(NODE_SELECTOR) !== null;
  if (!hasNodeInside) {
    out.push([el, el.matches(NODE_SELECTOR) ? "node" : "type"]);
    return;
  }
  if (depth >= MAX_DEPTH) return;
  for (const child of Array.from(el.children)) collectTargets(child, depth + 1, out);
}

/**
 * Drives the "signal trace" scroll system. Sections get a beam + scanner-lit heading when
 * they arrive, inner surfaces open between two shutter blades and spring into their frame,
 * and a gutter rail tracks scroll progress. Blades and scanners live in a separate overlay
 * layer so the effects are transform/opacity only and never sit inside interactive content.
 */
export function ScrollChoreographer() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const layer = layerRef.current;
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    if (sections.length === 0) return;

    const vh = () => window.innerHeight || 1;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    const accentOf = new WeakMap<HTMLElement, string>();
    const sectionStart = new WeakMap<HTMLElement, number>();
    const traced: HTMLElement[] = [];

    for (const section of sections) {
      accentOf.set(section, getComputedStyle(section).getPropertyValue("--accent-rgb").trim());
      const body = section.querySelector<HTMLElement>(".scene-body");
      const heading = body?.querySelector<HTMLElement>(".section-heading");
      const visibleNow = section.getBoundingClientRect().top < vh() * 0.92;
      section.dataset.scene = visibleNow ? "done" : "wait";
      if (!body) continue;

      const targets: Array<[HTMLElement, TraceKind]> = [];
      for (const child of Array.from(body.children)) {
        if (child === heading) continue;
        collectTargets(child, 0, targets);
      }
      for (const [el, kind] of targets) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        el.dataset.traceKind = kind;
        el.dataset.trace = rect.top < vh() * 0.96 ? "done" : "wait";
        traced.push(el);
      }
    }

    root.dataset.scenes = "on";

    const spawn = (
      className: string,
      rect: DOMRect,
      accent: string,
      delayMs: number,
      lifeMs: number,
      extra?: Record<string, string>,
    ) => {
      const origin = layer.getBoundingClientRect();
      const fx = document.createElement("span");
      fx.className = className;
      fx.style.cssText =
        `left:${(rect.left - origin.left).toFixed(1)}px;top:${(rect.top - origin.top).toFixed(1)}px;` +
        `width:${rect.width.toFixed(1)}px;height:${rect.height.toFixed(1)}px;` +
        `--fx-delay:${delayMs}ms;--fx-h:${rect.height.toFixed(1)}px;` +
        (accent ? `--accent-rgb:${accent};` : "");
      if (extra) for (const [key, value] of Object.entries(extra)) fx.style.setProperty(key, value);
      fx.innerHTML = "<i></i><i></i>";
      layer.appendChild(fx);
      later(() => fx.remove(), delayMs + lifeMs);
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = entry.target as HTMLElement;
          sectionObserver.unobserve(section);
          if (section.dataset.scene !== "wait") continue;
          const title = section.querySelector<HTMLElement>(".type-section-title");
          if (title) spawn("trace-fx-scan", title.getBoundingClientRect(), accentOf.get(section) ?? "", 140, 1500);
          section.dataset.scene = "in";
          sectionStart.set(section, performance.now());
          later(() => {
            section.dataset.scene = "done";
          }, SCENE_SETTLE_MS);
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0 },
    );

    const traceObserver = new IntersectionObserver(
      (entries) => {
        const arriving = entries
          .filter((entry) => entry.isIntersecting && (entry.target as HTMLElement).dataset.trace === "wait")
          .map((entry) => ({ el: entry.target as HTMLElement, rect: entry.boundingClientRect }))
          .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);

        const width = window.innerWidth || 1;
        const now = performance.now();
        arriving.forEach(({ el, rect }, order) => {
          traceObserver.unobserve(el);
          const section = el.closest<HTMLElement>("[data-scene]");
          const sinceHeading = section ? now - (sectionStart.get(section) ?? 0) : Infinity;
          const headingLead = Math.max(0, HEADING_LEAD_MS - sinceHeading);
          const dx = Math.min(1, Math.max(0, (rect.left + rect.width / 2) / width));
          const delay = Math.round(headingLead + Math.min(order, 6) * STAGGER_MS + dx * 140);

          // Measure before switching state: the "in" keyframes start offset, the blades must not.
          if (el.dataset.traceKind === "node" && section) {
            spawn("trace-fx-blades", el.getBoundingClientRect(), accentOf.get(section) ?? "", delay, 1300, {
              "--fx-radius": getComputedStyle(el).borderRadius,
            });
          }
          el.style.setProperty("--trace-delay", `${delay}ms`);
          el.style.setProperty("--trace-swing", (dx - 0.5).toFixed(3));
          el.dataset.trace = "in";
          later(() => {
            el.dataset.trace = "done";
            el.style.removeProperty("--trace-delay");
            el.style.removeProperty("--trace-swing");
          }, delay + NODE_SETTLE_MS);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    for (const section of sections) {
      if (section.dataset.scene === "wait") sectionObserver.observe(section);
    }
    for (const el of traced) {
      if (el.dataset.trace === "wait") traceObserver.observe(el);
    }

    // Progress is written only on the rail and heading so a scroll frame never restyles a
    // whole section subtree.
    const progressTargets = sections.map((section) =>
      [section.querySelector<HTMLElement>(".scene-rail"), section.querySelector<HTMLElement>(".section-heading")].filter(
        (el): el is HTMLElement => el !== null,
      ),
    );
    const lastProgress = new Array<number>(sections.length).fill(-1);
    let frame = 0;
    const measure = () => {
      frame = 0;
      const height = vh();
      const rects = sections.map((section) => section.getBoundingClientRect());
      rects.forEach((rect, index) => {
        if (rect.bottom < -height * 0.25 || rect.top > height * 1.25) return;
        const progress = Math.min(1, Math.max(0, (height * 0.82 - rect.top) / (rect.height + height * 0.32)));
        if (Math.abs(lastProgress[index] - progress) < 0.002) return;
        lastProgress[index] = progress;
        const value = progress.toFixed(4);
        for (const el of progressTargets[index]) el.style.setProperty("--scene-p", value);
      });
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      sectionObserver.disconnect();
      traceObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
      layer.replaceChildren();
      delete root.dataset.scenes;
      for (const section of sections) delete section.dataset.scene;
      for (const targets of progressTargets) for (const el of targets) el.style.removeProperty("--scene-p");
      for (const el of traced) {
        delete el.dataset.trace;
        delete el.dataset.traceKind;
      }
    };
  }, []);

  return <div ref={layerRef} className="trace-fx-layer" aria-hidden="true" />;
}
