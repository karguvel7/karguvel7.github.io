"use client";

import { useEffect, useId, useState } from "react";
import { mobileNav, primaryNav, site } from "@/lib/content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="text-sm font-medium tracking-tight text-ink">
          {site.givenName}
          <span className="text-faint"> K</span>
        </a>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:border-faint"
          >
            Email
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-line text-ink xl:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      <div id={menuId} hidden={!open} className="border-t border-line xl:hidden">
        <nav className="mx-auto flex w-full max-w-6xl flex-col px-5 py-3 sm:px-8" aria-label="Mobile">
          {mobileNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-sm px-1 py-2.5 text-sm text-muted hover:text-ink"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="mt-2 w-fit border border-line px-3 py-2 text-sm text-ink"
            onClick={() => setOpen(false)}
          >
            Email {site.email}
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
