"use client";

import { useLayoutEffect } from "react";
import { applyTheme, readStoredPreference } from "@/lib/theme";

/** Re-apply theme after React hydrates (inline script attrs are stripped from <html>). */
export function ThemeBootstrap() {
  useLayoutEffect(() => {
    applyTheme(readStoredPreference());
  }, []);

  return null;
}
