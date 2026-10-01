export type WeatherKind = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "storm";

export type WeatherSnapshot = {
  kind: WeatherKind;
  code: number | null;
  cloudCover: number;
  windKmh: number;
  windFromDeg: number;
  temperatureC: number | null;
  isDay: boolean;
  source: "live" | "cache" | "fallback" | "override";
};

export const WEATHER_LOCATION = { name: "Chennai", latitude: 13.0827, longitude: 80.2707 } as const;

export const WEATHER_LABELS: Record<WeatherKind, string> = {
  clear: "Clear",
  partly: "Partly cloudy",
  cloudy: "Overcast",
  fog: "Mist",
  drizzle: "Drizzle",
  rain: "Rain",
  storm: "Thunderstorm",
};

export const FALLBACK_WEATHER: WeatherSnapshot = {
  kind: "clear",
  code: null,
  cloudCover: 10,
  windKmh: 8,
  windFromDeg: 90,
  temperatureC: null,
  isDay: true,
  source: "fallback",
};

const CACHE_KEY = "kk-weather-chennai-v1";
const CACHE_TTL_MS = 15 * 60 * 1000;

/** WMO weather interpretation codes, as returned by Open-Meteo. */
export function kindFromCode(code: number, cloudCover: number): WeatherKind {
  if (code >= 95) return "storm";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code === 45 || code === 48) return "fog";
  if (code === 3 || (code >= 71 && code <= 77) || code === 85 || code === 86) return "cloudy";
  if (code === 2) return cloudCover > 85 ? "cloudy" : "partly";
  if (code === 1) return cloudCover > 40 ? "partly" : "clear";
  return "clear";
}

function overrideFromUrl(): WeatherSnapshot | null {
  const value = new URLSearchParams(window.location.search).get("weather");
  if (!value || !(value in WEATHER_LABELS)) return null;
  const kind = value as WeatherKind;
  const cover: Record<WeatherKind, number> = {
    clear: 5,
    partly: 45,
    cloudy: 100,
    fog: 70,
    drizzle: 90,
    rain: 100,
    storm: 100,
  };
  return { ...FALLBACK_WEATHER, kind, cloudCover: cover[kind], windKmh: kind === "storm" ? 28 : 12, source: "override" };
}

export async function loadChennaiWeather(): Promise<WeatherSnapshot> {
  const override = overrideFromUrl();
  if (override) return override;

  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as { at: number; data: WeatherSnapshot };
      if (Date.now() - parsed.at < CACHE_TTL_MS) return { ...parsed.data, source: "cache" };
    }
  } catch {
    /* storage unavailable */
  }

  const params = new URLSearchParams({
    latitude: String(WEATHER_LOCATION.latitude),
    longitude: String(WEATHER_LOCATION.longitude),
    current: "temperature_2m,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,is_day",
    timezone: "Asia/Kolkata",
  });

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal });
    if (!response.ok) return FALLBACK_WEATHER;
    const body = (await response.json()) as {
      current?: {
        temperature_2m?: number;
        weather_code?: number;
        cloud_cover?: number;
        wind_speed_10m?: number;
        wind_direction_10m?: number;
        is_day?: number;
      };
    };
    const current = body.current;
    if (!current || typeof current.weather_code !== "number") return FALLBACK_WEATHER;
    const cloudCover = current.cloud_cover ?? 0;
    const data: WeatherSnapshot = {
      kind: kindFromCode(current.weather_code, cloudCover),
      code: current.weather_code,
      cloudCover,
      windKmh: current.wind_speed_10m ?? 0,
      windFromDeg: current.wind_direction_10m ?? 90,
      temperatureC: current.temperature_2m ?? null,
      isDay: current.is_day !== 0,
      source: "live",
    };
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
    } catch {
      /* storage unavailable */
    }
    return data;
  } catch {
    return FALLBACK_WEATHER;
  } finally {
    window.clearTimeout(timeout);
  }
}

let currentSnapshot: WeatherSnapshot | null = null;
const listeners = new Set<() => void>();

export function publishWeather(snapshot: WeatherSnapshot) {
  currentSnapshot = snapshot;
  listeners.forEach((listener) => listener());
}

export function subscribeWeather(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getWeatherSnapshot() {
  return currentSnapshot;
}

export function weatherLabel(snapshot: WeatherSnapshot) {
  const temperature = snapshot.temperatureC !== null ? ` ${Math.round(snapshot.temperatureC)}°C` : "";
  return `${WEATHER_LABELS[snapshot.kind]}${temperature}`;
}
