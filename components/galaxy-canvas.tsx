"use client";

import { useEffect, useRef } from "react";
import { afterLoadIdle } from "@/lib/idle";

type Rgb = readonly [number, number, number];

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  a: number;
  tw: number;
  tws: number;
  c: Rgb;
  flare: boolean;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  flash: number;
};

type Ripple = { x: number; y: number; age: number };

type Meteor = { x: number; y: number; vx: number; vy: number; age: number; life: number; len: number };

type Palette = {
  light: boolean;
  temps: Rgb[];
  bandCool: Rgb;
  bandWarm: Rgb;
  microStar: Rgb;
  glowAlpha: number;
  bandAlpha: number;
  line: Rgb;
};

const MARGIN = 140;
const GRAVITY_RADIUS = 190;
const LINK_DISTANCE = 92;
const RIPPLE_SPEED = 520;
const RIPPLE_LIFE = 1.25;
const MAX_STAR_RADIUS = 1.9;

const DARK: Palette = {
  light: false,
  temps: [
    [196, 212, 255],
    [232, 238, 255],
    [255, 250, 242],
    [255, 236, 208],
    [255, 212, 168],
  ],
  bandCool: [150, 172, 230],
  bandWarm: [255, 228, 196],
  microStar: [236, 240, 255],
  glowAlpha: 0.034,
  bandAlpha: 0.95,
  line: [205, 218, 255],
};

const LIGHT: Palette = {
  light: true,
  temps: [
    [51, 65, 85],
    [71, 85, 105],
    [30, 41, 59],
    [79, 70, 160],
    [100, 116, 139],
  ],
  bandCool: [100, 116, 160],
  bandWarm: [120, 110, 140],
  microStar: [51, 65, 85],
  glowAlpha: 0.018,
  bandAlpha: 0.8,
  line: [51, 65, 85],
};

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
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function mod(value: number, size: number) {
  return ((value % size) + size) % size;
}

function rgba([r, g, b]: Rgb, a: number) {
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/** Diagonal galactic plane across the padded world, bulging toward the core. */
function bandGeometry(W: number, H: number) {
  const ax = -0.06 * W;
  const ay = 0.9 * H;
  const bx = 1.06 * W;
  const by = 0.1 * H;
  const len = Math.hypot(bx - ax, by - ay);
  const ux = (bx - ax) / len;
  const uy = (by - ay) / len;
  const nx = -uy;
  const ny = ux;
  const point = (t: number) => ({ x: ax + (bx - ax) * t, y: ay + (by - ay) * t });
  const width = (t: number) => H * (0.06 + 0.085 * Math.exp(-((t - 0.56) ** 2) / 0.035));
  const core = (t: number) => Math.exp(-((t - 0.56) ** 2) / 0.02);
  return { ux, uy, nx, ny, point, width, core };
}

function buildBand(W: number, H: number, palette: Palette, scale: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(W * scale);
  canvas.height = Math.ceil(H * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.scale(scale, scale);

  const rng = mulberry32(palette.light ? 0x5eed11 : 0x9a1a7);
  const geo = bandGeometry(W, H);

  ctx.globalCompositeOperation = palette.light ? "source-over" : "lighter";
  const stamps = 110;
  for (let i = 0; i <= stamps; i += 1) {
    const t = i / stamps;
    const p = geo.point(t);
    const bw = geo.width(t);
    const col = mix(palette.bandCool, palette.bandWarm, geo.core(t));
    const outer = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, bw * 1.9);
    outer.addColorStop(0, rgba(col, palette.glowAlpha));
    outer.addColorStop(0.45, rgba(col, palette.glowAlpha * 0.55));
    outer.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = outer;
    ctx.beginPath();
    ctx.arc(p.x, p.y, bw * 1.9, 0, Math.PI * 2);
    ctx.fill();

    const coreAlpha = palette.glowAlpha * 1.4 * (0.35 + geo.core(t));
    const inner = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, bw * 0.75);
    inner.addColorStop(0, rgba(palette.bandWarm, coreAlpha));
    inner.addColorStop(1, rgba(palette.bandWarm, 0));
    ctx.fillStyle = inner;
    ctx.beginPath();
    ctx.arc(p.x, p.y, bw * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!palette.light) {
    const emission: Rgb[] = [
      [255, 130, 160],
      [255, 150, 120],
      [140, 200, 255],
    ];
    for (let cluster = 0; cluster < 7; cluster += 1) {
      const t = 0.2 + rng() * 0.65;
      const p = geo.point(t);
      const bw = geo.width(t);
      const off = gaussian(rng) * bw * 0.45;
      const cx = p.x + geo.nx * off;
      const cy = p.y + geo.ny * off;
      const col = emission[cluster % emission.length];
      for (let k = 0; k < 10; k += 1) {
        const x = cx + gaussian(rng) * 14 + geo.ux * gaussian(rng) * 26;
        const y = cy + gaussian(rng) * 14 + geo.uy * gaussian(rng) * 26;
        const r = 8 + rng() * 20;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, rgba(col, 0.022));
        g.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const micro = Math.round(Math.min(16000, Math.max(2600, (W * H) / 55)));
  ctx.globalCompositeOperation = "source-over";
  for (let i = 0; i < micro; i += 1) {
    const t = rng();
    const p = geo.point(t);
    const bw = geo.width(t);
    const off = gaussian(rng) * bw * 0.5;
    const falloff = Math.exp(-(off * off) / (2 * (bw * 0.55) ** 2));
    const x = p.x + geo.nx * off + geo.ux * (rng() - 0.5) * 10;
    const y = p.y + geo.ny * off + geo.uy * (rng() - 0.5) * 10;
    const base = palette.light ? 0.05 + rng() * 0.18 : 0.1 + rng() * 0.5;
    const a = base * (0.35 + falloff * 0.65) * (0.7 + geo.core(t) * 0.3);
    const r = 0.3 + rng() ** 3 * 0.85;
    ctx.fillStyle = rgba(palette.microStar, a);
    if (r < 0.55) {
      ctx.fillRect(x, y, r * 1.6, r * 1.6);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalCompositeOperation = "destination-out";
  const rifts = [
    { from: 0.12, to: 0.96, offset: 0.08, wave: 0.22, thickness: 0.2, alpha: 0.3 },
    { from: 0.38, to: 0.78, offset: -0.32, wave: 0.12, thickness: 0.1, alpha: 0.22 },
    { from: 0.55, to: 0.9, offset: 0.4, wave: 0.1, thickness: 0.07, alpha: 0.18 },
  ];
  for (const rift of rifts) {
    for (let t = rift.from; t <= rift.to; t += 0.0035) {
      const p = geo.point(t);
      const bw = geo.width(t);
      const lane = bw * (rift.offset + rift.wave * Math.sin(t * 11 + rift.offset * 7));
      const knot = 0.55 + 0.45 * Math.sin(t * 41) * Math.sin(t * 17 + 1.7);
      const r = bw * rift.thickness * (0.5 + knot);
      const x = p.x + geo.nx * lane;
      const y = p.y + geo.ny * lane;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(0,0,0,${(rift.alpha * (0.6 + knot * 0.4)).toFixed(3)})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  for (let i = 0; i < 160; i += 1) {
    const t = rng();
    const p = geo.point(t);
    const bw = geo.width(t);
    const off = gaussian(rng) * bw * 0.45;
    const x = p.x + geo.nx * off;
    const y = p.y + geo.ny * off;
    const r = 4 + rng() * 22;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(0,0,0,0.14)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

function buildGlowSprite(palette: Palette) {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const tint: Rgb = palette.light ? [51, 65, 85] : [225, 232, 255];
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, rgba(tint, 0.9));
  g.addColorStop(0.18, rgba(tint, 0.35));
  g.addColorStop(0.5, rgba(tint, 0.06));
  g.addColorStop(1, rgba(tint, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

function createStars(W: number, H: number, count: number, palette: Palette): Star[] {
  const rng = mulberry32(palette.light ? 0x1ee7 : 0xc0ffee);
  const geo = bandGeometry(W, H);
  const pickTemp = () => {
    const roll = rng();
    if (roll < 0.18) return palette.temps[0];
    if (roll < 0.62) return palette.temps[1];
    if (roll < 0.85) return palette.temps[2];
    if (roll < 0.96) return palette.temps[3];
    return palette.temps[4];
  };

  const stars: Star[] = [];
  for (let i = 0; i < count; i += 1) {
    let x: number;
    let y: number;
    if (rng() < 0.32) {
      const t = rng();
      const p = geo.point(t);
      const off = gaussian(rng) * geo.width(t) * 0.8;
      x = p.x + geo.nx * off;
      y = p.y + geo.ny * off;
    } else {
      x = rng() * W;
      y = rng() * H;
    }

    const roll = rng();
    let r: number;
    let a: number;
    let z: number;
    if (roll < 0.7) {
      r = 0.35 + rng() * 0.4;
      a = 0.25 + rng() * 0.4;
      z = 0.2 + rng() * 0.3;
    } else if (roll < 0.96) {
      r = 0.7 + rng() * 0.5;
      a = 0.5 + rng() * 0.4;
      z = 0.45 + rng() * 0.35;
    } else {
      r = 1.2 + rng() * 0.7;
      a = 0.8 + rng() * 0.2;
      z = 0.75 + rng() * 0.25;
    }

    if (palette.light) {
      a *= 0.55;
      r *= 0.8;
    }

    stars.push({
      x,
      y,
      z,
      r,
      a,
      tw: rng() * Math.PI * 2,
      tws: 0.6 + rng() * 2.2,
      c: pickTemp(),
      flare: false,
      ox: 0,
      oy: 0,
      vx: 0,
      vy: 0,
      flash: 0,
    });
  }

  stars
    .map((star, index) => ({ index, score: star.r * star.a }))
    .sort((p, q) => q.score - p.score)
    .slice(0, Math.max(5, Math.round(count / 180)))
    .forEach(({ index }) => {
      const star = stars[index];
      star.flare = true;
      star.r = Math.max(star.r, palette.light ? 1.1 : 1.4);
      star.a = Math.min(1, star.a + 0.15);
    });

  return stars;
}

export function GalaxyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    let W = 0;
    let H = 0;
    let dpr = 1;
    let palette: Palette = DARK;
    let band: HTMLCanvasElement | null = null;
    let sprite: HTMLCanvasElement | null = null;
    let stars: Star[] = [];
    const ripples: Ripple[] = [];
    const meteors: Meteor[] = [];
    let nextMeteor = 4 + Math.random() * 5;

    const pointer = { x: -9999, y: -9999, inside: false };
    const smooth = { x: -9999, y: -9999 };
    const parallax = { x: 0, y: 0 };
    let presence = 0;

    let raf = 0;
    let last = performance.now();
    let running = false;
    let ready = false;

    const animated = () => !reducedQuery.matches;
    const interactive = () => animated() && !coarseQuery.matches;

    const rebuild = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      W = w + MARGIN * 2;
      H = h + MARGIN * 2;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      palette = root.dataset.theme === "light" ? LIGHT : DARK;
      if (palette.light) {
        band = null;
        sprite = null;
        stars = [];
        return;
      }
      band = buildBand(W, H, palette, Math.min(dpr, 1.25));
      sprite = buildGlowSprite(palette);
      const density = coarseQuery.matches ? 1700 : 1100;
      const count = Math.round(Math.min(1700, Math.max(420, (w * h) / density)));
      stars = createStars(W, H, count, palette);
    };

    const draw = (dt: number) => {
      const motion = animated();
      const live = interactive();

      presence += ((live && pointer.inside ? 1 : 0) - presence) * Math.min(1, dt * 4);
      if (smooth.x < -9000 && pointer.x > -9000) {
        smooth.x = pointer.x;
        smooth.y = pointer.y;
      }
      smooth.x += (pointer.x - smooth.x) * Math.min(1, dt * 9);
      smooth.y += (pointer.y - smooth.y) * Math.min(1, dt * 9);

      const targetPx = live && pointer.inside ? (smooth.x - w / 2) / w : 0;
      const targetPy = live && pointer.inside ? (smooth.y - h / 2) / h : 0;
      parallax.x += (targetPx - parallax.x) * Math.min(1, dt * 2.2);
      parallax.y += (targetPy - parallax.y) * Math.min(1, dt * 2.2);

      const scrollY = window.scrollY || 0;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (band) {
        const bandShift = Math.min(scrollY * 0.035, MARGIN * 0.9);
        ctx.globalAlpha = palette.bandAlpha;
        ctx.drawImage(band, -MARGIN - parallax.x * 18, -MARGIN - parallax.y * 12 - bandShift, W, H);
        ctx.globalAlpha = 1;
      }

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        ripples[i].age += dt;
        if (ripples[i].age > RIPPLE_LIFE) ripples.splice(i, 1);
      }

      const near: { x: number; y: number; k: number }[] = [];
      const step = Math.min(dt * 60, 2.5);

      for (const star of stars) {
        const baseX = star.x - MARGIN - parallax.x * 46 * star.z;
        const baseY = mod(star.y - scrollY * 0.07 * star.z - parallax.y * 32 * star.z, H) - MARGIN;

        let tx = 0;
        let ty = 0;
        let boost = 0;

        if (presence > 0.01) {
          const dx = smooth.x - baseX;
          const dy = smooth.y - baseY;
          const d = Math.hypot(dx, dy);
          if (d < GRAVITY_RADIUS && d > 0.5) {
            const k = 1 - d / GRAVITY_RADIUS;
            const pull = k * k * 28 * (0.35 + star.z) * presence;
            const swirl = pull * 0.6;
            tx = (dx / d) * pull - (dy / d) * swirl;
            ty = (dy / d) * pull + (dx / d) * swirl;
            boost = k * presence;
          }
        }

        for (const ripple of ripples) {
          const dx = baseX - ripple.x;
          const dy = baseY - ripple.y;
          const d = Math.hypot(dx, dy) || 1;
          const front = ripple.age * RIPPLE_SPEED;
          const hit = 1 - Math.abs(d - front) / 46;
          if (hit > 0) {
            const fade = 1 - ripple.age / RIPPLE_LIFE;
            star.vx += (dx / d) * hit * 1.6 * star.z * fade;
            star.vy += (dy / d) * hit * 1.6 * star.z * fade;
            star.flash = Math.max(star.flash, hit * fade);
          }
        }

        if (motion) {
          star.vx = (star.vx + (tx - star.ox) * 0.055 * step) * 0.86;
          star.vy = (star.vy + (ty - star.oy) * 0.055 * step) * 0.86;
          star.ox += star.vx * step;
          star.oy += star.vy * step;
          star.tw += star.tws * dt;
          star.flash *= Math.max(0, 1 - dt * 2.6);
        }

        const x = baseX + star.ox;
        const y = baseY + star.oy;
        if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue;

        const scint = motion ? 0.72 + 0.28 * Math.sin(star.tw) : 1;
        const alpha = Math.min(1, star.a * scint * (1 + boost * 1.7 + star.flash * 1.4));
        const radius = Math.min(MAX_STAR_RADIUS, star.r * (1 + boost * 0.35 + star.flash * 0.25));

        if (star.flare && sprite && !palette.light) {
          const glow = radius * 4.5;
          ctx.globalAlpha = alpha * 0.32;
          ctx.drawImage(sprite, x - glow / 2, y - glow / 2, glow, glow);
          ctx.globalAlpha = 1;
        }

        if (star.flare) {
          const spike = radius * (7 + scint * 4);
          ctx.strokeStyle = rgba(star.c, alpha * 0.32);
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(x - spike, y);
          ctx.lineTo(x + spike, y);
          ctx.moveTo(x, y - spike);
          ctx.lineTo(x, y + spike);
          ctx.stroke();
        }

        ctx.fillStyle = rgba(star.c, alpha);
        if (radius < 0.7) {
          ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        if (boost > 0.18 && star.r > 0.5) near.push({ x, y, k: boost });
      }

      if (near.length > 1) {
        near.sort((p, q) => q.k - p.k);
        const nodes = near.slice(0, 18);
        ctx.lineWidth = 0.6;
        for (let i = 0; i < nodes.length; i += 1) {
          let links = 0;
          for (let j = i + 1; j < nodes.length && links < 2; j += 1) {
            const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (d > LINK_DISTANCE) continue;
            const a = Math.min(nodes[i].k, nodes[j].k) * (1 - d / LINK_DISTANCE) * (palette.light ? 0.3 : 0.42);
            ctx.strokeStyle = rgba(palette.line, a);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            links += 1;
          }
        }
      }

      if (motion) {
        nextMeteor -= dt;
        if (nextMeteor <= 0) {
          const angle = Math.PI * (0.16 + Math.random() * 0.12);
          const speed = 700 + Math.random() * 500;
          meteors.push({
            x: w * (0.15 + Math.random() * 0.75),
            y: h * (Math.random() * 0.35),
            vx: -Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1),
            vy: Math.sin(angle) * speed,
            age: 0,
            life: 0.7 + Math.random() * 0.5,
            len: 110 + Math.random() * 120,
          });
          nextMeteor = 6 + Math.random() * 8;
        }

        for (let i = meteors.length - 1; i >= 0; i -= 1) {
          const m = meteors[i];
          m.age += dt;
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          if (m.age > m.life) {
            meteors.splice(i, 1);
            continue;
          }
          const life = m.age / m.life;
          const fade = Math.sin(Math.PI * life);
          const speed = Math.hypot(m.vx, m.vy);
          const tailX = m.x - (m.vx / speed) * m.len;
          const tailY = m.y - (m.vy / speed) * m.len;
          const g = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          g.addColorStop(0, rgba(palette.line, fade * (palette.light ? 0.35 : 0.75)));
          g.addColorStop(1, rgba(palette.line, 0));
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(dt);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!ready || running || document.hidden || palette.light) return;
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

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!ready) return;
        rebuild();
        if (!running) draw(0);
      }, 140);
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
      if (!animated()) return;
      ripples.push({ x: event.clientX, y: event.clientY, age: 0 });
      if (ripples.length > 4) ripples.shift();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onMotionChange = () => {
      stop();
      start();
    };

    const themeObserver = new MutationObserver(() => {
      const next = root.dataset.theme === "light" ? LIGHT : DARK;
      if (ready && next !== palette) {
        stop();
        rebuild();
        start();
      }
    });

    // Star field + band are CPU-heavy; build them off the critical path so the hero paints first.
    const cancelInit = afterLoadIdle(() => {
      ready = true;
      rebuild();
      start();
      canvas.dataset.ready = "true";
    });

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedQuery.addEventListener("change", onMotionChange);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      cancelInit();
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onMotionChange);
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="galaxy-canvas" aria-hidden="true" />;
}
