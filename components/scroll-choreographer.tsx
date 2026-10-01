"use client";

import { useEffect } from "react";

const NODE_SELECTOR =
  ".diagram-surface, .panel-accent-rail, .lab-card, .platform-tile, .timeline-item, .project-showcase";
const MAX_DEPTH = 4;
const SETTLE_MS = 1500;

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
 * Drives the "signal trace" scroll system: sections get a beam + heading focus pull
 * when their heading arrives, inner surfaces open like shutters in reading order, and
 * a gutter rail tracks scroll progress through each section via `--scene-p`.
 */
export function ScrollChoreographer() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

    const sectionStart = new WeakMap<HTMLElement, number>();
    const traced: HTMLElement[] = [];

    for (const section of sections) {
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

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = entry.target as HTMLElement;
          sectionObserver.unobserve(section);
          if (section.dataset.scene !== "wait") continue;
          section.dataset.scene = "in";
          sectionStart.set(section, performance.now());
          later(() => {
            section.dataset.scene = "done";
          }, 1900);
        }
      },
      { rootMargin: "0px 0px -22% 0px", threshold: 0 },
    );

    const traceObserver = new IntersectionObserver(
      (entries) => {
        const arriving = entries
          .filter((entry) => entry.isIntersecting && (entry.target as HTMLElement).dataset.trace === "wait")
          .map((entry) => ({ el: entry.target as HTMLElement, rect: entry.boundingClientRect }))
          .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);

        const width = window.innerWidth || 1;
        arriving.forEach(({ el, rect }, order) => {
          traceObserver.unobserve(el);
          const section = el.closest<HTMLElement>("[data-scene]");
          const sinceHeading = section ? performance.now() - (sectionStart.get(section) ?? 0) : 9999;
          const headingLead = sinceHeading < 450 ? 300 : 0;
          const dx = Math.min(1, Math.max(0, (rect.left + rect.width / 2) / width));
          const delay = Math.round(headingLead + Math.min(order, 7) * 85 + dx * 160);

          el.style.setProperty("--trace-delay", `${delay}ms`);
          el.style.setProperty("--trace-swing", (dx - 0.5).toFixed(3));
          el.dataset.trace = "in";
          later(() => {
            el.dataset.trace = "done";
            el.style.removeProperty("--trace-delay");
            el.style.removeProperty("--trace-swing");
          }, delay + SETTLE_MS);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );

    for (const section of sections) {
      if (section.dataset.scene === "wait") sectionObserver.observe(section);
    }
    for (const el of traced) {
      if (el.dataset.trace === "wait") traceObserver.observe(el);
    }

    let frame = 0;
    const lastProgress = new WeakMap<HTMLElement, number>();
    const measure = () => {
      frame = 0;
      const height = vh();
      const rects = sections.map((section) => section.getBoundingClientRect());
      rects.forEach((rect, index) => {
        if (rect.bottom < -height * 0.25 || rect.top > height * 1.25) return;
        const progress = Math.min(1, Math.max(0, (height * 0.82 - rect.top) / (rect.height + height * 0.32)));
        const section = sections[index];
        if (Math.abs((lastProgress.get(section) ?? -1) - progress) < 0.003) return;
        lastProgress.set(section, progress);
        section.style.setProperty("--scene-p", progress.toFixed(3));
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
      delete root.dataset.scenes;
      for (const section of sections) {
        delete section.dataset.scene;
        section.style.removeProperty("--scene-p");
      }
      for (const el of traced) {
        delete el.dataset.trace;
        delete el.dataset.traceKind;
      }
    };
  }, []);

  return null;
}
