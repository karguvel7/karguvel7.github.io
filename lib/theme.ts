export const THEME_STORAGE_KEY = "portfolio-theme-preference";

export type ThemePreference = "system" | "light" | "dark";

/** First-time visitors (no saved preference) start in dark mode. */
export const DEFAULT_THEME_PREFERENCE: ThemePreference = "dark";

export type ResolvedTheme = "light" | "dark";

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === "light") return "light";
  if (preference === "dark") return "dark";
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(preference: ThemePreference) {
  const root = document.documentElement;
  const resolved = resolveTheme(preference);
  root.dataset.themePreference = preference;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
}

export function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return DEFAULT_THEME_PREFERENCE;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return DEFAULT_THEME_PREFERENCE;
}

/** Inline boot script — must run before first paint (static export safe). */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var def=${JSON.stringify(DEFAULT_THEME_PREFERENCE)};function apply(){var p=localStorage.getItem(k)||def;var d=p==="dark"||(p==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.dataset.themePreference=p;r.dataset.theme=d?"dark":"light";r.style.colorScheme=d?"dark":"light";}apply();document.addEventListener("DOMContentLoaded",apply);if(typeof requestAnimationFrame==="function"){requestAnimationFrame(function(){apply();requestAnimationFrame(apply);});}}catch(e){document.documentElement.dataset.theme="dark";document.documentElement.dataset.themePreference="dark";document.documentElement.style.colorScheme="dark";}})();`;
