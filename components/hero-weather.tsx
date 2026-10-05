"use client";

import { useSyncExternalStore } from "react";
import { getWeatherSnapshot, subscribeWeather, weatherLabel } from "@/lib/weather";

export function HeroWeather() {
  const snapshot = useSyncExternalStore(subscribeWeather, getWeatherSnapshot, () => null);

  // The empty span reserves the slot so the label arriving later never shifts the hero.
  return (
    <span className="hero-weather" data-source={snapshot?.source}>
      {snapshot ? (
        <>
          <span className="hero-weather-sep px-2" aria-hidden="true">
            ·
          </span>
          {weatherLabel(snapshot)}
        </>
      ) : null}
    </span>
  );
}
