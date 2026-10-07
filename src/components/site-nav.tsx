"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(NAV[0].id);
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV.map((item) => document.getElementById(item.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const bar = indicatorRef.current;
    const wrap = navRef.current;
    if (!bar || !wrap) return;
    const link = wrap.querySelector<HTMLAnchorElement>(`[data-nav="${active}"]`);
    if (!link) return;
    const parent = link.parentElement;
    if (!parent) return;
    bar.style.width = `${link.offsetWidth}px`;
    bar.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [active, scrolled]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-50 h-0.5 bg-soft"
        aria-hidden
      >
        <div
          className="h-full origin-left bg-ink transition-transform duration-150"
          style={{
            transform: `scaleX(${typeof window === "undefined" ? 0 : undefined})`,
          }}
          id="scroll-progress-bar"
        />
      </div>
      <header className="fixed inset-x-0 top-0 z-40 pt-3">
        <div className="shell flex items-center justify-between gap-4">
          <a href="#" className="group flex items-center gap-3 no-underline text-ink">
            <span
              className={`grid h-11 w-11 place-items-center rounded-full border border-ink text-sm font-bold transition-all duration-500 ease-[var(--ease)] group-hover:rotate-[360deg] ${
                scrolled ? "bg-ink text-paper" : "bg-transparent"
              }`}
            >
              {PROFILE.initials}
            </span>
            <span
              className={`hidden font-semibold tracking-tight sm:block transition-opacity duration-300 ${
                scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              {PROFILE.name}
            </span>
          </a>

          <nav
            ref={navRef}
            className={`relative hidden items-center gap-1 rounded-full border px-2 py-1.5 md:flex transition-all duration-500 ${
              scrolled
                ? "border-line bg-white/70 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(13,13,13,.06)]"
                : "border-line bg-card"
            }`}
            aria-label="Primary"
          >
            {NAV.map((item) => (
              <a
                key={item.id}
                data-nav={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(item.href, -72);
                }}
                className={`relative z-10 rounded-full px-3 py-2 text-sm font-semibold no-underline transition-colors ${
                  active === item.id ? "text-ink" : "text-mute hover:text-ink"
                }`}
              >
                {item.label}
              </a>
            ))}
            <span
              ref={indicatorRef}
              className="pointer-events-none absolute bottom-1.5 left-0 z-0 h-8 rounded-full bg-soft transition-transform duration-500 ease-[var(--ease)]"
              aria-hidden
            />
          </nav>

          <button
            type="button"
            className="pill md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 bg-paper transition-[clip-path] duration-700 ease-[var(--ease)] md:hidden ${
          open ? "clip-path-open" : "clip-path-closed"
        }`}
        style={{
          clipPath: open
            ? "circle(150% at 100% 0%)"
            : "circle(0% at 100% 0%)",
        }}
        hidden={!open}
      >
        <div className="shell flex h-full flex-col justify-center gap-6 pt-20">
          {NAV.map((item, i) => (
            <a
              key={item.id}
              href={item.href}
              className="rv is-in flex items-baseline gap-4 text-4xl font-bold tracking-tight text-ink no-underline"
              style={{ "--i": i } as React.CSSProperties}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                scrollToTarget(item.href, -72);
              }}
            >
              <span className="font-mono text-base text-mute">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.label}
            </a>
          ))}
        </div>
      </div>
      <ScrollProgressWire />
    </>
  );
}

function ScrollProgressWire() {
  useEffect(() => {
    const bar = document.getElementById("scroll-progress-bar");
    if (!bar) return;
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? doc.scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return null;
}
