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

function starField(count, rng, mode) {
  const parts = [];
  for (let i = 0; i < count; i += 1) {
    const x = rng() * 100;
    const y = rng() * 100;
    const roll = rng();
    const r = 0.12 + rng() ** 1.8 * 1.65;
    const opacity =
      mode === "dark"
        ? 0.18 + rng() ** 0.65 * 0.82
        : 0.12 + rng() ** 0.7 * 0.55;

    let rgb = "248,250,252";
    if (roll > 0.93) rgb = "186,210,255";
    else if (roll > 0.975) rgb = "255,236,210";
    else if (mode === "light") rgb = "71,85,105";

    parts.push(
      `<circle cx="${x.toFixed(4)}" cy="${y.toFixed(4)}" r="${r.toFixed(4)}" fill="rgba(${rgb},${opacity.toFixed(4)})"/>`,
    );
  }
  return parts.join("\n");
}

function milkyLayer(mode) {
  const core =
    mode === "dark"
      ? [
          ["0%", "transparent"],
          ["28%", "rgba(120,150,255,0.03)"],
          ["42%", "rgba(210,220,255,0.09)"],
          ["50%", "rgba(190,170,255,0.13)"],
          ["58%", "rgba(220,235,255,0.08)"],
          ["68%", "rgba(130,180,255,0.05)"],
          ["82%", "transparent"],
        ]
      : [
          ["0%", "transparent"],
          ["30%", "rgba(37,99,235,0.02)"],
          ["44%", "rgba(109,40,217,0.045)"],
          ["52%", "rgba(37,99,235,0.05)"],
          ["62%", "rgba(2,132,199,0.035)"],
          ["78%", "transparent"],
        ];

  const stops = core.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");
  const dustOpacity = mode === "dark" ? 0.85 : 0.55;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="milky" gradientUnits="userSpaceOnUse" x1="120" y1="80" x2="1480" y2="820">
      ${stops}
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <filter id="haze" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="42"/>
    </filter>
  </defs>
  <g transform="rotate(-24 800 450)" opacity="${dustOpacity}">
    <ellipse cx="800" cy="450" rx="920" ry="210" fill="url(#milky)" filter="url(#haze)"/>
    <ellipse cx="760" cy="430" rx="680" ry="120" fill="rgba(255,255,255,0.04)" filter="url(#soft)"/>
    <ellipse cx="880" cy="470" rx="540" ry="90" fill="rgba(140,170,255,0.06)" filter="url(#soft)"/>
  </g>
</svg>`;
}

function starsSvg(mode, count, seed) {
  const rng = createRng(seed);
  const stars = starField(count, rng, mode);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
  <rect width="100" height="100" fill="transparent"/>
  ${stars}
</svg>`;
}

writeFileSync(join(outDir, "stars-dark.svg"), starsSvg("dark", 920, 0x9e3779b9));
writeFileSync(join(outDir, "stars-light.svg"), starsSvg("light", 680, 0x85ebca6b));
writeFileSync(join(outDir, "milky-dark.svg"), milkyLayer("dark"));
writeFileSync(join(outDir, "milky-light.svg"), milkyLayer("light"));

console.log("Generated galaxy assets in public/galaxy/");
