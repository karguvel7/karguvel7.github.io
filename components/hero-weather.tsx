"use client";

import { useSyncExternalStore } from "react";
import { getWeatherSnapshot, subscribeWeather, weatherLabel } from "@/lib/weather";

export function HeroWeather() {
  const snapshot = useSyncExternalStore(subscribeWeather, getWeatherSnapshot, () => null);
  if (!snapshot) return null;

  return (
    <span className="hero-weather" data-source={snapshot.source}>
      <span className="px-2" aria-hidden="true">
        ·
      </span>
      {weatherLabel(snapshot)}
    </span>
  );
}
