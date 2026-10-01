"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  readStoredPreference,
  resolveTheme,
  type ResolvedTheme,
  type ThemePreference,
  THEME_STORAGE_KEY,
} from "@/lib/theme";

const cycle: ThemePreference[] = ["system", "light", "dark"];

function readPreferenceFromDom(): ThemePreference {
  if (typeof document === "undefined") return "system";
  const fromDom = document.documentElement.dataset.themePreference;
  if (fromDom === "light" || fromDom === "dark" || fromDom === "system") return fromDom;
  return readStoredPreference();
}

function readResolvedFromDom(): ResolvedTheme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [preference, setPreference] = useState<ThemePreference>(() => readPreferenceFromDom());
  const [resolved, setResolved] = useState<ResolvedTheme>(() => readResolvedFromDom());

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (readStoredPreference() !== "system") return;
      applyTheme("system");
      setResolved(resolveTheme("system"));
      setPreference("system");
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  const onToggle = useCallback(() => {
    const index = cycle.indexOf(preference);
    const next = cycle[(index + 1) % cycle.length] ?? "system";
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
    setPreference(next);
    setResolved(resolveTheme(next));
  }, [preference]);

  const label =
    preference === "system"
      ? `Color theme: system (${resolved}). Activate to switch to light mode.`
      : preference === "light"
        ? "Color theme: light. Activate to switch to dark mode."
        : "Color theme: dark. Activate to switch to system preference.";

  return (
    <button
      type="button"
      className={`theme-toggle btn-secondary inline-flex h-11 w-11 shrink-0 items-center justify-center border border-line text-ink ${className}`.trim()}
      onClick={onToggle}
      aria-pressed={preference !== "system"}
      aria-label={label}
      title={label}
    >
      <ThemeIcon preference={preference} resolved={resolved} />
    </button>
  );
}

function ThemeIcon({
  preference,
  resolved,
}: {
  preference: ThemePreference;
  resolved: ResolvedTheme;
}) {
  if (preference === "system") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none">
        <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M9 2.5v13M2.5 9h13" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
        <path d="M9 2.5a6.5 6.5 0 0 1 0 13V2.5Z" fill="currentColor" opacity={resolved === "dark" ? 0.85 : 0.35} />
      </svg>
    );
  }
  if (preference === "light") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none">
        <circle cx="9" cy="9" r="3.2" fill="currentColor" />
        <path
          d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.4 3.4l1.4 1.4M13.2 13.2l1.4 1.4M3.4 14.6l1.4-1.4M13.2 4.8l1.4-1.4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none">
      <path
        d="M14.2 11.1A5.8 5.8 0 0 1 6.9 3.8 5.8 5.8 0 1 0 14.2 11.1Z"
        fill="currentColor"
      />
    </svg>
  );
}
