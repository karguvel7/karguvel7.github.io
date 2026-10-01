import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "public", "galaxy");
mkdirSync(outDir, { recursive: true });

function createRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function starField(count, rng, mode, profile) {
  const parts = [];
  for (let i = 0; i < count; i += 1) {
    const x = rng() * 100;
    const y = rng() * 100;
    const roll = rng();
    const sizeRoll = rng();

    let r;
    let opacity;
    if (profile === "deep") {
      r = 0.04 + sizeRoll ** 2.2 * 0.22;
      opacity = mode === "dark" ? 0.08 + rng() ** 0.8 * 0.35 : 0.06 + rng() ** 0.85 * 0.22;
    } else if (profile === "near") {
      r = 0.22 + sizeRoll ** 1.4 * 1.1;
      opacity = mode === "dark" ? 0.35 + rng() ** 0.5 * 0.65 : 0.2 + rng() ** 0.55 * 0.45;
    } else {
      r = 0.1 + sizeRoll ** 1.65 * 0.85;
      opacity = mode === "dark" ? 0.15 + rng() ** 0.65 * 0.78 : 0.1 + rng() ** 0.7 * 0.48;
    }

    let rgb = "248,250,252";
    if (roll > 0.94) rgb = "186,210,255";
    else if (roll > 0.985) rgb = "255,236,210";
    else if (mode === "light") rgb = "71,85,105";

    parts.push(
      `<circle cx="${x.toFixed(4)}" cy="${y.toFixed(4)}" r="${r.toFixed(4)}" fill="rgba(${rgb},${opacity.toFixed(4)})"/>`,
    );
  }
  return parts.join("\n");
}

function milkyLayer(mode) {
  const band =
    mode === "dark"
      ? [
          ["0%", "rgba(2,4,12,0)"],
          ["18%", "rgba(8,12,28,0.02)"],
          ["34%", "rgba(180,195,230,0.045)"],
          ["44%", "rgba(220,228,245,0.11)"],
          ["50%", "rgba(235,240,255,0.14)"],
          ["56%", "rgba(210,218,240,0.09)"],
          ["66%", "rgba(140,160,210,0.04)"],
          ["82%", "rgba(2,4,12,0)"],
        ]
      : [
          ["0%", "rgba(255,255,255,0)"],
          ["22%", "rgba(37,99,235,0.015)"],
          ["40%", "rgba(71,85,105,0.035)"],
          ["50%", "rgba(51,65,85,0.05)"],
          ["60%", "rgba(37,99,235,0.03)"],
          ["78%", "rgba(255,255,255,0)"],
        ];

  const stops = band.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");
  const rng = createRng(mode === "dark" ? 0xcafebabe : 0xdeadbeef);
  const dustLanes = Array.from({ length: mode === "dark" ? 14 : 9 }, (_, i) => {
    const t = 0.22 + (i / 14) * 0.58;
    const cx = 120 + t * 1360 + (rng() - 0.5) * 80;
    const cy = 450 + (rng() - 0.5) * 140;
    const w = 40 + rng() * 120;
    const h = 4 + rng() * 14;
    const rot = -24 + (rng() - 0.5) * 8;
    const alpha = mode === "dark" ? 0.12 + rng() * 0.16 : 0.06 + rng() * 0.08;
    return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${w.toFixed(1)}" ry="${h.toFixed(1)}" transform="rotate(${rot.toFixed(2)} ${cx.toFixed(1)} ${cy.toFixed(1)})" fill="rgba(0,0,0,${alpha.toFixed(3)})"/>`;
  }).join("\n    ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="milkyBand" gradientUnits="userSpaceOnUse" x1="80" y1="120" x2="1520" y2="780">
      ${stops}
    </linearGradient>
    <linearGradient id="milkyCore" gradientUnits="userSpaceOnUse" x1="400" y1="300" x2="1200" y2="600">
      <stop offset="0%" stop-color="rgba(255,255,255,0)"/>
      <stop offset="45%" stop-color="${mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(51,65,85,0.04)"}"/>
      <stop offset="55%" stop-color="${mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(51,65,85,0.05)"}"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
    <filter id="bandSoft" x="-15%" y="-40%" width="130%" height="180%">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
    <filter id="bandHaze" x="-25%" y="-50%" width="150%" height="200%">
      <feGaussianBlur stdDeviation="28"/>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4" result="n"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.035 0" in="n" result="g"/>
      <feBlend in="SourceGraphic" in2="g" mode="screen"/>
    </filter>
  </defs>
  <g transform="rotate(-22 800 450)" filter="url(#grain)">
    <rect x="-200" y="280" width="2000" height="340" fill="url(#milkyBand)" filter="url(#bandHaze)" opacity="${mode === "dark" ? "0.92" : "0.75"}"/>
    <rect x="100" y="340" width="1400" height="220" fill="url(#milkyCore)" filter="url(#bandSoft)" opacity="${mode === "dark" ? "0.85" : "0.65"}"/>
    ${dustLanes}
  </g>
</svg>`;
}

function dustLanesSvg(mode) {
  const rng = createRng(mode === "dark" ? 0x515151 : 0x424242);
  const lanes = Array.from({ length: mode === "dark" ? 18 : 12 }, () => {
    const t = rng();
    const x1 = 80 + t * 1440;
    const y1 = 320 + (rng() - 0.5) * 200;
    const len = 180 + rng() * 420;
    const w = 1.5 + rng() * 5;
    const alpha = mode === "dark" ? 0.08 + rng() * 0.14 : 0.04 + rng() * 0.07;
    const x2 = x1 + Math.cos(-0.38) * len;
    const y2 = y1 + Math.sin(-0.38) * len;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(0,0,0,${alpha.toFixed(3)})" stroke-width="${w.toFixed(2)}" stroke-linecap="round"/>`;
  }).join("\n  ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
  <g transform="rotate(-22 800 450)" opacity="${mode === "dark" ? "0.9" : "0.55"}">
  ${lanes}
  </g>
</svg>`;
}

function starsSvg(mode, count, seed, profile) {
  const rng = createRng(seed);
  const stars = starField(count, rng, mode, profile);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
  <rect width="100" height="100" fill="transparent"/>
  ${stars}
</svg>`;
}

for (const mode of ["dark", "light"]) {
  const deepCount = mode === "dark" ? 2400 : 1600;
  const mainCount = mode === "dark" ? 1100 : 720;
  const nearCount = mode === "dark" ? 120 : 80;
  const seedBase = mode === "dark" ? 0x9e3779b9 : 0x85ebca6b;

  writeFileSync(join(outDir, `stars-${mode}-deep.svg`), starsSvg(mode, deepCount, seedBase ^ 0x111, "deep"));
  writeFileSync(join(outDir, `stars-${mode}.svg`), starsSvg(mode, mainCount, seedBase, "mid"));
  writeFileSync(join(outDir, `stars-${mode}-near.svg`), starsSvg(mode, nearCount, seedBase ^ 0x222, "near"));
  writeFileSync(join(outDir, `milky-${mode}.svg`), milkyLayer(mode));
  writeFileSync(join(outDir, `dust-${mode}.svg`), dustLanesSvg(mode));
}

console.log("Generated galaxy assets in public/galaxy/");
