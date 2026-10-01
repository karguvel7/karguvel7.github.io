"use client";

import { useEffect, useState } from "react";

const nodes = [
  { id: "n1", label: "Agent", x: 18, y: 28 },
  { id: "n2", label: "Tools", x: 42, y: 18 },
  { id: "n3", label: "API", x: 68, y: 32 },
  { id: "n4", label: "Cloud", x: 52, y: 58 },
  { id: "n5", label: "Obs", x: 24, y: 62 },
] as const;

const edges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
  [0, 2],
];

export function HeroAgentViz() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (document.documentElement.dataset.motion !== "on") return;
    const timer = window.setInterval(() => setPulse((v) => (v + 1) % edges.length), 2200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hero-agent-viz glass-panel relative mt-8 overflow-hidden p-4 sm:p-5" aria-hidden="true">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">System topology</p>
      <svg viewBox="0 0 100 72" className="mt-3 h-36 w-full sm:h-40" role="presentation">
        {edges.map(([a, b], index) => {
          const from = nodes[a];
          const to = nodes[b];
          const active = index === pulse;
          return (
            <line
              key={`${a}-${b}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={`hero-viz-edge ${active ? "is-active" : ""}`}
            />
          );
        })}
        {nodes.map((node, index) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={4.2}
              className={`hero-viz-node ${index === pulse ? "is-active" : ""}`}
            />
            <text x={node.x} y={node.y + 11} textAnchor="middle" className="hero-viz-label">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
