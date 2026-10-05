"use client";

import { useEffect, useRef } from "react";
import { afterLoadIdle } from "@/lib/idle";
import {
  FALLBACK_WEATHER,
  loadChennaiWeather,
  publishWeather,
  type WeatherKind,
  type WeatherSnapshot,
} from "@/lib/weather";

type Rgb = readonly [number, number, number];

type Cloud = {
  x: number;
  y: number;
  scale: number;
  stretch: number;
  depth: number;
  alpha: number;
  sprite: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
};

type Drop = { x: number; y: number; len: number; speed: number; gust: number };

type Bolt = { points: { x: number; y: number }[]; age: number };

type Scene = {
  sun: number;
  tint: number;
  clouds: number;
  cloudAlpha: number;
  rain: number;
  lightning: boolean;
  fog: boolean;
  haze: boolean;
};

const SCENES: Record<WeatherKind, Scene> = {
  clear: { sun: 1, tint: 0, clouds: 2, cloudAlpha: 0.55, rain: 0, lightning: false, fog: false, haze: true },
  partly: { sun: 0.9, tint: 0.12, clouds: 6, cloudAlpha: 0.8, rain: 0, lightning: false, fog: false, haze: true },
  cloudy: { sun: 0.5, tint: 0.62, clouds: 11, cloudAlpha: 0.9, rain: 0, lightning: false, fog: false, haze: false },
  fog: { sun: 0.42, tint: 0.3, clouds: 4, cloudAlpha: 0.7, rain: 0, lightning: false, fog: true, haze: false },
  drizzle: { sun: 0.38, tint: 0.55, clouds: 10, cloudAlpha: 0.9, rain: 150, lightning: false, fog: false, haze: false },
  rain: { sun: 0.28, tint: 0.7, clouds: 12, cloudAlpha: 0.95, rain: 340, lightning: false, fog: false, haze: false },
  storm: { sun: 0.18, tint: 0.85, clouds: 13, cloudAlpha: 1, rain: 460, lightning: true, fog: false, haze: false },
};

const SKY_CLEAR_TOP: Rgb = [150, 192, 238];
const SKY_GREY_TOP: Rgb = [172, 182, 198];
const SKY_STORM_TOP: Rgb = [128, 140, 162];
const SKY_BOTTOM: Rgb = [238, 241, 246];

const SUN_RADIUS = 44;
const SUN_PULL_RADIUS = 520;
const CLOUD_PART_RADIUS = 240;
const UMBRELLA_RADIUS = 96;

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rng: () => number) {
  const u = Math.max(rng(), 1e-6);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function rgba([r, g, b]: Rgb, a: number) {
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
}

function wrap(value: number, min: number, max: number) {
  const span = max - min;
  return ((((value - min) % span) + span) % span) + min;
}

/** Many small, faint puffs summed into one soft mass so no single circle edge is visible. */
function buildCloudSprite(seed: number) {
  const width = 640;
  const height = 260;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const rng = mulberry32(seed);
  const base = height * 0.68;
  for (let i = 0; i < 120; i += 1) {
    const spread = gaussian(rng) * width * 0.2;
    const x = width / 2 + spread;
    const lift = Math.abs(gaussian(rng)) * height * 0.2 * (1 - Math.min(1, Math.abs(spread) / (width * 0.45)));
    const y = base - lift;
    const r = 26 + rng() * 46 * (1 - Math.min(0.7, Math.abs(spread) / (width * 0.5)));
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,0.32)");
    g.addColorStop(0.55, "rgba(255,255,255,0.16)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  ctx.globalCompositeOperation = "source-atop";
  const shade = ctx.createLinearGradient(0, height * 0.25, 0, height * 0.85);
  shade.addColorStop(0, "rgba(255,255,255,0)");
  shade.addColorStop(0.5, "rgba(206,214,228,0.5)");
  shade.addColorStop(1, "rgba(140,154,180,0.85)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, width, height);
  return canvas;
}

export function DaylightSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const weatherRef = useRef<WeatherSnapshot>(FALLBACK_WEATHER);

  useEffect(() => {
    let cancelled = false;
    loadChennaiWeather().then((snapshot) => {
      if (cancelled) return;
      weatherRef.current = snapshot;
      publishWeather(snapshot);
      document.documentElement.dataset.weather = snapshot.kind;
      window.dispatchEvent(new CustomEvent("kk-weather", { detail: snapshot }));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = document.documentElement;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");

    let w = 0;
    let h = 0;
    let dpr = 1;
    let scene: Scene = SCENES[weatherRef.current.kind];
    let sprites: HTMLCanvasElement[] = [];
    let clouds: Cloud[] = [];
    let drops: Drop[] = [];
    const bolts: Bolt[] = [];
    let flash = 0;
    let nextBolt = 3 + Math.random() * 4;

    const pointer = { x: -9999, y: -9999, inside: false };
    const smooth = { x: -9999, y: -9999 };
    const sunOffset = { x: 0, y: 0, vx: 0, vy: 0 };
    let presence = 0;
    let sunGlow = 0;
    let pulse = 0;
    let rayAngle = 0;
    let time = 0;

    let raf = 0;
    let last = performance.now();
    let running = false;
    let ready = false;

    const isLight = () => root.dataset.theme === "light";
    const animated = () => !reducedQuery.matches;
    const interactive = () => animated() && !coarseQuery.matches;

    const windVx = () => {
      const wx = weatherRef.current;
      const from = (wx.windFromDeg * Math.PI) / 180;
      return -Math.sin(from) * Math.max(4, wx.windKmh);
    };

    const sunBase = () => ({ x: w * (w < 760 ? 0.8 : 0.535), y: Math.max(92, h * 0.15) });

    const populate = () => {
      scene = SCENES[weatherRef.current.kind];
      const rng = mulberry32(0x5a11 + weatherRef.current.kind.length);
      const coverClouds = Math.round((weatherRef.current.cloudCover / 100) * 12);
      const count = Math.max(scene.clouds, Math.min(14, coverClouds));
      clouds = Array.from({ length: count }, (_, index) => {
        const depth = 0.4 + rng() * 0.6;
        return {
          x: rng() * (w + 600) - 300,
          y: h * (0.02 + rng() * (scene.fog ? 0.75 : 0.42)) + index * 3,
          scale: (0.55 + rng() * 0.65) * (w < 760 ? 0.6 : 1) * (0.7 + depth * 0.4),
          stretch: scene.fog ? 2.6 + rng() : 1 + rng() * 0.6,
          depth,
          alpha: scene.cloudAlpha * (0.55 + depth * 0.45),
          sprite: index % Math.max(1, sprites.length),
          ox: 0,
          oy: 0,
          vx: 0,
          vy: 0,
        };
      });
      clouds.sort((a, b) => a.depth - b.depth);

      const dropCount = Math.round(scene.rain * Math.min(1.4, (w * h) / (1440 * 900)));
      drops = Array.from({ length: dropCount }, () => ({
        x: rng() * (w + 200) - 100,
        y: rng() * h,
        len: 10 + rng() * 14,
        speed: 620 + rng() * 380,
        gust: 0,
      }));
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      if (!sprites.length) sprites = [0x11, 0x22, 0x33, 0x44, 0x55].map(buildCloudSprite);
      populate();
    };

    const drawSky = () => {
      const top = scene.lightning
        ? mix(SKY_CLEAR_TOP, SKY_STORM_TOP, scene.tint)
        : mix(SKY_CLEAR_TOP, SKY_GREY_TOP, scene.tint);
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, rgba(top, 1));
      g.addColorStop(0.5, rgba(mix(top, SKY_BOTTOM, 0.55), 1));
      g.addColorStop(1, rgba(SKY_BOTTOM, 1));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const drawSun = (sx: number, sy: number) => {
      const strength = scene.sun;
      const boost = sunGlow + pulse;

      const halo = 300 * (1 + boost * 0.18);
      const hg = ctx.createRadialGradient(sx, sy, SUN_RADIUS * 0.6, sx, sy, halo);
      hg.addColorStop(0, `rgba(255,246,222,${(0.7 * strength + boost * 0.25).toFixed(3)})`);
      hg.addColorStop(0.3, `rgba(255,232,186,${(0.32 * strength + boost * 0.12).toFixed(3)})`);
      hg.addColorStop(1, "rgba(255,226,170,0)");
      ctx.fillStyle = hg;
      ctx.fillRect(sx - halo, sy - halo, halo * 2, halo * 2);

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(rayAngle);
      const rays = 16;
      for (let i = 0; i < rays; i += 1) {
        const angle = (i / rays) * Math.PI * 2;
        const length = (230 + 120 * Math.sin(i * 2.3 + time * 0.6)) * (1 + boost * 0.3);
        const spread = 0.05 + (i % 3) * 0.012;
        const rg = ctx.createLinearGradient(0, 0, Math.cos(angle) * length, Math.sin(angle) * length);
        rg.addColorStop(0, `rgba(255,238,196,${(0.32 * strength + boost * 0.16).toFixed(3)})`);
        rg.addColorStop(1, "rgba(255,236,190,0)");
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle - spread) * length, Math.sin(angle - spread) * length);
        ctx.lineTo(Math.cos(angle + spread) * length, Math.sin(angle + spread) * length);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      const r = SUN_RADIUS * (1 + boost * 0.08);
      const bloomRadius = r * 2.6;
      const bloom = ctx.createRadialGradient(sx, sy, r * 0.4, sx, sy, bloomRadius);
      bloom.addColorStop(0, `rgba(255,252,238,${(0.7 * (0.5 + strength * 0.5) + boost * 0.2).toFixed(3)})`);
      bloom.addColorStop(1, "rgba(255,240,205,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(sx - bloomRadius, sy - bloomRadius, bloomRadius * 2, bloomRadius * 2);

      const discAlpha = 0.6 + strength * 0.4;
      const dg = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
      dg.addColorStop(0, `rgba(255,255,255,${discAlpha.toFixed(3)})`);
      dg.addColorStop(0.7, `rgba(255,253,244,${discAlpha.toFixed(3)})`);
      dg.addColorStop(0.9, `rgba(255,246,222,${(discAlpha * 0.8).toFixed(3)})`);
      dg.addColorStop(1, "rgba(255,244,215,0)");
      ctx.fillStyle = dg;
      ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
    };

    const drawBeam = (sx: number, sy: number) => {
      if (presence < 0.02) return;
      const dx = smooth.x - sx;
      const dy = smooth.y - sy;
      const d = Math.hypot(dx, dy);
      if (d < SUN_RADIUS * 2) return;
      const nx = -dy / d;
      const ny = dx / d;
      const spread = 30 + d * 0.08;
      const bg = ctx.createLinearGradient(sx, sy, smooth.x, smooth.y);
      bg.addColorStop(0, `rgba(255,232,180,${(0.2 * presence * (0.4 + scene.sun * 0.6)).toFixed(3)})`);
      bg.addColorStop(1, "rgba(255,232,180,0)");
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.moveTo(sx + nx * 6, sy + ny * 6);
      ctx.lineTo(smooth.x + nx * spread, smooth.y + ny * spread);
      ctx.lineTo(smooth.x - nx * spread, smooth.y - ny * spread);
      ctx.lineTo(sx - nx * 6, sy - ny * 6);
      ctx.closePath();
      ctx.fill();
    };

    const draw = (dt: number) => {
      const motion = animated();
      const live = interactive();
      const step = Math.min(dt * 60, 2.5);
      time += dt;

      presence += ((live && pointer.inside ? 1 : 0) - presence) * Math.min(1, dt * 4);
      if (smooth.x < -9000 && pointer.x > -9000) {
        smooth.x = pointer.x;
        smooth.y = pointer.y;
      }
      smooth.x += (pointer.x - smooth.x) * Math.min(1, dt * 9);
      smooth.y += (pointer.y - smooth.y) * Math.min(1, dt * 9);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawSky();

      const base = sunBase();
      let targetX = 0;
      let targetY = 0;
      let glowTarget = 0;
      if (presence > 0.01) {
        const dx = smooth.x - base.x;
        const dy = smooth.y - base.y;
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.max(0, 1 - d / SUN_PULL_RADIUS);
        targetX = (dx / d) * Math.min(d * 0.12, 46) * k * presence;
        targetY = (dy / d) * Math.min(d * 0.12, 46) * k * presence;
        glowTarget = k * presence;
      }
      if (motion) {
        sunOffset.vx = (sunOffset.vx + (targetX - sunOffset.x) * 0.04 * step) * 0.86;
        sunOffset.vy = (sunOffset.vy + (targetY - sunOffset.y) * 0.04 * step) * 0.86;
        sunOffset.x += sunOffset.vx * step;
        sunOffset.y += sunOffset.vy * step;
        sunGlow += (glowTarget - sunGlow) * Math.min(1, dt * 5);
        pulse *= Math.max(0, 1 - dt * 1.8);
        rayAngle += dt * (0.03 + sunGlow * 0.12 + pulse * 0.5);
      }
      const sx = base.x + sunOffset.x;
      const sy = base.y + sunOffset.y;

      drawSun(sx, sy);
      drawBeam(sx, sy);

      if (scene.haze) {
        const hz = ctx.createLinearGradient(0, h * 0.6, 0, h);
        hz.addColorStop(0, "rgba(255,250,240,0)");
        hz.addColorStop(1, "rgba(255,248,236,0.45)");
        ctx.fillStyle = hz;
        ctx.fillRect(0, h * 0.6, w, h * 0.4);
      }

      const drift = windVx() * 0.9;
      for (const cloud of clouds) {
        const sprite = sprites[cloud.sprite];
        if (!sprite) continue;
        const cw = sprite.width * cloud.scale * cloud.stretch;
        const ch = sprite.height * cloud.scale;
        if (motion) cloud.x += drift * cloud.depth * dt;
        cloud.x = wrap(cloud.x, -cw - 40, w + 40);

        let tx = 0;
        let ty = 0;
        if (presence > 0.01) {
          const cx = cloud.x + cw / 2 + cloud.ox;
          const cy = cloud.y + ch * 0.6 + cloud.oy;
          const dx = cx - smooth.x;
          const dy = cy - smooth.y;
          const d = Math.hypot(dx, dy) || 1;
          const reach = CLOUD_PART_RADIUS + cw * 0.25;
          if (d < reach) {
            const k = 1 - d / reach;
            tx = (dx / d) * k * 90 * presence;
            ty = (dy / d) * k * 40 * presence;
          }
        }
        if (motion) {
          cloud.vx = (cloud.vx + (tx - cloud.ox) * 0.02 * step) * 0.9;
          cloud.vy = (cloud.vy + (ty - cloud.oy) * 0.02 * step) * 0.9;
          cloud.ox += cloud.vx * step;
          cloud.oy += cloud.vy * step;
        }

        ctx.globalAlpha = cloud.alpha;
        ctx.drawImage(sprite, cloud.x + cloud.ox, cloud.y + cloud.oy, cw, ch);
      }
      ctx.globalAlpha = 1;

      if (scene.fog) {
        ctx.fillStyle = "rgba(246,248,251,0.32)";
        ctx.fillRect(0, 0, w, h);
      }

      if (drops.length) {
        const slant = windVx() * 4;
        ctx.strokeStyle = scene.lightning ? "rgba(70,86,112,0.42)" : "rgba(84,102,130,0.36)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const drop of drops) {
          if (motion) {
            drop.y += drop.speed * dt;
            drop.x += (slant + drop.gust) * dt;
            drop.gust *= Math.max(0, 1 - dt * 2.5);
            if (presence > 0.01) {
              const dx = drop.x - smooth.x;
              const dy = drop.y - smooth.y;
              const d = Math.hypot(dx, dy);
              if (d < UMBRELLA_RADIUS && d > 0.5) {
                const push = (UMBRELLA_RADIUS - d) * 0.45 * presence;
                drop.x += (dx / d) * push;
                drop.y += (dy / d) * push * 0.3;
              }
            }
            if (drop.y > h + 20) {
              drop.y = -drop.len - Math.random() * 60;
              drop.x = Math.random() * (w + 200) - 100;
            }
            drop.x = wrap(drop.x, -100, w + 100);
          }
          const vx = (slant + drop.gust) / drop.speed;
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - vx * drop.len, drop.y - drop.len);
        }
        ctx.stroke();
      }

      if (scene.lightning && motion) {
        nextBolt -= dt;
        if (nextBolt <= 0) {
          const points: { x: number; y: number }[] = [];
          let x = w * (0.1 + Math.random() * 0.8);
          let y = 0;
          while (y < h * (0.3 + Math.random() * 0.2)) {
            points.push({ x, y });
            x += (Math.random() - 0.5) * 46;
            y += 18 + Math.random() * 30;
          }
          bolts.push({ points, age: 0 });
          flash = 1;
          nextBolt = 4 + Math.random() * 6;
        }
      }

      for (let i = bolts.length - 1; i >= 0; i -= 1) {
        const bolt = bolts[i];
        bolt.age += dt;
        if (bolt.age > 0.45) {
          bolts.splice(i, 1);
          continue;
        }
        const fade = 1 - bolt.age / 0.45;
        const flicker = bolt.age < 0.08 || (bolt.age > 0.14 && bolt.age < 0.2) ? 1 : 0.4;
        ctx.save();
        ctx.shadowColor = "rgba(210,220,255,0.9)";
        ctx.shadowBlur = 14;
        ctx.strokeStyle = `rgba(255,255,255,${(fade * flicker).toFixed(3)})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        bolt.points.forEach((p, index) => (index ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.stroke();
        ctx.restore();
      }

      if (flash > 0.01) {
        ctx.fillStyle = `rgba(255,255,255,${(flash * 0.5).toFixed(3)})`;
        ctx.fillRect(0, 0, w, h);
        flash *= Math.max(0, 1 - dt * 6);
      }
    };

    const clear = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(dt);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!ready || running || document.hidden) return;
      if (!isLight()) {
        clear();
        return;
      }
      if (!animated()) {
        draw(0);
        return;
      }
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const restart = () => {
      stop();
      start();
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!ready) return;
        resize();
        if (!running && isLight()) draw(0);
      }, 140);
    };

    const onWeather = () => {
      if (!ready) return;
      populate();
      if (!running && isLight()) draw(0);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) pointer.inside = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!animated() || !isLight()) return;
      pulse = Math.min(1, pulse + 0.7);
      for (const cloud of clouds) {
        const sprite = sprites[cloud.sprite];
        if (!sprite) continue;
        const cx = cloud.x + (sprite.width * cloud.scale * cloud.stretch) / 2;
        const cy = cloud.y + sprite.height * cloud.scale * 0.6;
        const dx = cx - event.clientX;
        const dy = cy - event.clientY;
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.max(0, 1 - d / 700);
        cloud.vx += (dx / d) * k * 9;
        cloud.vy += (dy / d) * k * 3;
      }
      for (const drop of drops) {
        const dx = drop.x - event.clientX;
        const d = Math.abs(dx) || 1;
        const k = Math.max(0, 1 - d / 420);
        drop.gust += Math.sign(dx) * k * 900;
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const themeObserver = new MutationObserver(restart);

    // Cloud sprites are CPU-heavy; build them off the critical path so the hero paints first.
    const cancelInit = afterLoadIdle(() => {
      ready = true;
      resize();
      start();
      canvas.dataset.ready = "true";
    });

    window.addEventListener("resize", onResize);
    window.addEventListener("kk-weather", onWeather);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedQuery.addEventListener("change", restart);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      cancelInit();
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("kk-weather", onWeather);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", restart);
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="daylight-canvas" aria-hidden="true" />;
}
