"use client";

import { useEffect, useId, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { mobileNav, primaryNav, site } from "@/lib/content";

const sectionIds = ["#top", ...primaryNav.map((item) => item.href)];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("#top");
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const onChange = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((href) => document.querySelector(href))
      .filter((node): node is HTMLElement => node instanceof HTMLElement);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveHref(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`header-shell header-premium sticky top-0 z-40 border-b border-line/40 bg-canvas/65 backdrop-blur-xl supports-[backdrop-filter]:bg-canvas/55 ${scrolled ? "is-scrolled" : ""}`}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="text-sm font-medium tracking-tight text-ink">
          {site.givenName}
          <span className="text-faint"> K</span>
        </a>

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link text-sm ${activeHref === item.href ? "is-active text-ink" : "text-muted hover:text-ink"}`}
            >
              {item.label}
            </a>
          ))}
          <ThemeToggle />
          <a
            href={`mailto:${site.email}`}
            className="btn-secondary btn-secondary-accent border border-line px-3 py-1.5 text-sm text-ink"
          >
            Email
          </a>
        </nav>

        <div className="site-header-actions flex items-center gap-2 xl:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="btn-secondary inline-flex h-11 w-11 shrink-0 items-center justify-center border border-line text-ink"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      <div id={menuId} hidden={!open} className="border-t border-line xl:hidden">
        <nav className="mx-auto flex w-full max-w-6xl flex-col px-5 py-3 sm:px-8" aria-label="Mobile">
          {mobileNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`rounded-sm px-2 py-2.5 text-sm transition-colors ${activeHref === item.href ? "text-ink" : "text-muted hover:text-ink"}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="btn-secondary mt-2 w-full max-w-full border border-line px-3 py-2.5 text-sm text-ink sm:w-fit"
            onClick={() => setOpen(false)}
          >
            Email
          </a>
        </nav>
      </div>
    </header>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none">
      {open ? (
        <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.4" />
      ) : (
        <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.4" />
      )}
    </svg>
  );
}
