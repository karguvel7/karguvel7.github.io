"use client";

import { useEffect, useState } from "react";

const nodes = [
  { id: "n1", label: "Agent", x: 16, y: 30, accent: "violet" },
  { id: "n2", label: "Tools", x: 38, y: 16, accent: "violet" },
  { id: "n3", label: "API", x: 64, y: 28, accent: "cyan" },
  { id: "n4", label: "Cloud", x: 56, y: 56, accent: "cyan" },
  { id: "n5", label: "Obs", x: 22, y: 58, accent: "amber" },
] as const;

const edges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
  [0, 2],
  [2, 4],
];

export function HeroAgentViz() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (document.documentElement.dataset.motion !== "on") return;
    const timer = window.setInterval(() => setPulse((v) => (v + 1) % edges.length), 1200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hero-agent-viz hero-agent-viz-live diagram-surface mt-10" aria-hidden="true">
      <div className="diagram-surface-header">
        <span className="diagram-status" data-accent="emerald">
          Live topology
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Orchestration mesh</span>
      </div>
      <svg viewBox="0 0 100 76" className="diagram-canvas mt-2 h-40 w-full sm:h-44" role="presentation">
        <defs>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(var(--accent-cyan-rgb))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="rgb(var(--accent-violet-rgb))" stopOpacity="0.45" />
            <stop offset="100%" stopColor="rgb(var(--accent-cyan-rgb))" stopOpacity="0.2" />
          </linearGradient>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <pattern id="diagGrid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path
            d="M 8 0 L 0 0 0 8"
            fill="none"
            className="hero-viz-grid-line"
            strokeWidth="0.25"
          />
        </pattern>
        <rect width="100" height="76" fill="url(#diagGrid)" />
        {edges.map(([a, b], index) => {
          const from = nodes[a];
          const to = nodes[b];
          const active = index === pulse;
          return (
            <g key={`${a}-${b}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={`hero-viz-edge ${active ? "is-active" : ""}`}
                stroke={active ? "url(#edgeGrad)" : undefined}
              />
              {active ? (
                <circle r="1.2" className="hero-viz-packet">
                  <animateMotion
                    dur="1.4s"
                    repeatCount="1"
                    path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                  />
                </circle>
              ) : null}
            </g>
          );
        })}
        {nodes.map((node, index) => (
          <g key={node.id} filter="url(#nodeGlow)">
            <circle
              cx={node.x}
              cy={node.y}
              r={activeRadius(index === pulse)}
              className={`hero-viz-node hero-viz-node-${node.accent} ${index === pulse ? "is-active" : ""}`}
            />
            <text x={node.x} y={node.y + 12} textAnchor="middle" className="hero-viz-label">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function activeRadius(active: boolean) {
  return active ? 5.2 : 4;
}
