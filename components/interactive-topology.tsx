"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { Accent } from "@/lib/accents";

export type TopologyNodeSpec = {
  id: string;
  label: string;
  x: number;
  y: number;
  accent: Accent;
  detail?: string;
};

export type TopologyEdgeSpec = { from: string; to: string };

type InteractiveTopologyProps = {
  viewBox: string;
  nodes: readonly TopologyNodeSpec[];
  edges: readonly TopologyEdgeSpec[];
  ariaLabel: string;
  hint?: string;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  variant?: "hero" | "skills";
  showPulse?: boolean;
  footer?: ReactNode;
};

type Point = { x: number; y: number };

type DragMode = "none" | "pan" | "node";

function parseViewBox(viewBox: string) {
  const parts = viewBox.split(/\s+/).map(Number);
  return {
    minX: parts[0] ?? 0,
    minY: parts[1] ?? 0,
    width: parts[2] ?? 100,
    height: parts[3] ?? 100,
  };
}

function edgeKey(from: string, to: string) {
  return `${from}::${to}`;
}

export function InteractiveTopology({
  viewBox,
  nodes,
  edges,
  ariaLabel,
  hint = "Drag nodes or pan the canvas. Arrow keys move focus; Enter selects.",
  selectedId: selectedIdProp,
  onSelect,
  variant = "hero",
  showPulse = false,
  footer,
}: InteractiveTopologyProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  const uid = useId().replace(/:/g, "");
  const gridPatternId = `topologyDiagGrid-${uid}`;
  const edgeGradId = `topologyEdgeGrad-${uid}`;
  const nodeGlowId = `topologyNodeGlow-${uid}`;

  const [positions, setPositions] = useState<Record<string, Point>>(() =>
    Object.fromEntries(nodes.map((node) => [node.id, { x: node.x, y: node.y }])),
  );
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const [pulseIndex, setPulseIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const dragRef = useRef<{
    mode: DragMode;
    pointerId: number;
    startClient: Point;
    startPan: Point;
    nodeId?: string;
    startNode?: Point;
    scrollLock?: boolean;
    moved?: boolean;
  }>({ mode: "none", pointerId: -1, startClient: { x: 0, y: 0 }, startPan: { x: 0, y: 0 } });

  const selectedId = selectedIdProp !== undefined ? selectedIdProp : internalSelected;
  const highlightId = hoverId ?? focusId ?? selectedId;

  const setSelected = useCallback(
    (id: string | null) => {
      if (onSelect) onSelect(id);
      else setInternalSelected(id);
      const node = nodes.find((n) => n.id === id);
      if (liveRef.current) {
        liveRef.current.textContent = node
          ? `${node.label}${node.detail ? ` — ${node.detail}` : ""}`
          : "Selection cleared";
      }
    },
    [nodes, onSelect],
  );

  const vb = useMemo(() => parseViewBox(viewBox), [viewBox]);

  const connectedEdges = useMemo(() => {
    if (!highlightId) return new Set<string>();
    const set = new Set<string>();
    edges.forEach((edge) => {
      if (edge.from === highlightId || edge.to === highlightId) {
        set.add(edgeKey(edge.from, edge.to));
      }
    });
    return set;
  }, [edges, highlightId]);

  const dragMovedRef = useRef(false);

  useEffect(() => {
    if (!showPulse || document.documentElement.dataset.motion !== "on") return;
    const timer = window.setInterval(() => setPulseIndex((value) => (value + 1) % edges.length), 1400);
    return () => window.clearInterval(timer);
  }, [edges.length, showPulse]);

  useEffect(() => {
    setPositions(Object.fromEntries(nodes.map((node) => [node.id, { x: node.x, y: node.y }])));
  }, [nodes]);

  const endDrag = useCallback((event: ReactPointerEvent | PointerEvent) => {
    const svg = svgRef.current;
    if (svg && dragRef.current.pointerId >= 0) {
      try {
        svg.releasePointerCapture(dragRef.current.pointerId);
      } catch {
        /* already released */
      }
    }
    dragRef.current = {
      mode: "none",
      pointerId: -1,
      startClient: { x: 0, y: 0 },
      startPan: { x: 0, y: 0 },
    };
    setDragging(false);
  }, []);

  const onPanSurfaceDown = (event: ReactPointerEvent<SVGRectElement>) => {
    if (event.button !== 0) return;
    const svg = svgRef.current;
    if (!svg) return;
    dragMovedRef.current = false;
    dragRef.current = {
      mode: "pan",
      pointerId: event.pointerId,
      startClient: { x: event.clientX, y: event.clientY },
      startPan: { ...pan },
      scrollLock: false,
      moved: false,
    };
    svg.setPointerCapture(event.pointerId);
    setDragging(true);
    event.preventDefault();
  };

  const onNodeDown = (nodeId: string, event: ReactPointerEvent<SVGGElement>) => {
    if (event.button !== 0) return;
    const svg = svgRef.current;
    if (!svg) return;
    const pos = positions[nodeId];
    if (!pos) return;
    dragMovedRef.current = false;
    dragRef.current = {
      mode: "node",
      pointerId: event.pointerId,
      startClient: { x: event.clientX, y: event.clientY },
      startPan: { ...pan },
      nodeId,
      startNode: { ...pos },
      moved: false,
    };
    svg.setPointerCapture(event.pointerId);
    setDragging(true);
    event.stopPropagation();
    event.preventDefault();
  };

  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (drag.mode === "none" || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startClient.x;
    const dy = event.clientY - drag.startClient.y;
    if (Math.hypot(dx, dy) > 4) dragMovedRef.current = true;

    if (drag.mode === "pan") {
      if (!drag.scrollLock && Math.abs(dy) > Math.abs(dx) * 1.2 && Math.abs(dy) > 8) {
        endDrag(event);
        return;
      }
      drag.scrollLock = true;
      const svg = svgRef.current;
      if (!svg) return;
      const scaleX = vb.width / svg.clientWidth;
      const scaleY = vb.height / svg.clientHeight;
      setPan({
        x: drag.startPan.x + dx * scaleX,
        y: drag.startPan.y + dy * scaleY,
      });
      return;
    }

    if (drag.mode === "node" && drag.nodeId && drag.startNode) {
      const svg = svgRef.current;
      if (!svg) return;
      const scaleX = vb.width / svg.clientWidth;
      const scaleY = vb.height / svg.clientHeight;
      setPositions((prev) => ({
        ...prev,
        [drag.nodeId!]: {
          x: drag.startNode!.x + dx * scaleX,
          y: drag.startNode!.y + dy * scaleY,
        },
      }));
    }
  };

  const onKeyDown = (event: KeyboardEvent<SVGGElement>, nodeId: string, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelected(selectedId === nodeId ? null : nodeId);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setSelected(null);
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = nodes[(index + 1) % nodes.length];
      document.getElementById(`topology-node-${next.id}`)?.focus();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const prev = nodes[(index - 1 + nodes.length) % nodes.length];
      document.getElementById(`topology-node-${prev.id}`)?.focus();
    }
  };

  const resetLayout = () => {
    setPan({ x: 0, y: 0 });
    setPositions(Object.fromEntries(nodes.map((node) => [node.id, { x: node.x, y: node.y }])));
    setSelected(null);
  };

  const heightClass = variant === "skills" ? "topology-canvas-skills" : "topology-canvas-hero";

  return (
    <div className={`topology-shell topology-shell-${variant}`}>
      <div className="topology-toolbar">
        <p className="topology-hint font-mono text-[10px] uppercase tracking-[0.12em] text-faint">{hint}</p>
        <button type="button" className="topology-reset btn-secondary btn-secondary-accent" onClick={resetLayout}>
          Reset layout
        </button>
      </div>

      <svg
        ref={svgRef}
        viewBox={viewBox}
        className={`diagram-canvas topology-canvas ${heightClass} ${dragging ? "is-dragging" : ""}`}
        role="img"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <title id={titleId}>{ariaLabel}</title>
        <desc id={descId}>{hint}</desc>
        <defs>
          <linearGradient id={edgeGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(var(--accent-cyan-rgb))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="rgb(var(--accent-violet-rgb))" stopOpacity="0.45" />
            <stop offset="100%" stopColor="rgb(var(--accent-cyan-rgb))" stopOpacity="0.2" />
          </linearGradient>
          <filter id={nodeGlowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id={gridPatternId} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" className="hero-viz-grid-line" strokeWidth="0.25" />
          </pattern>
        </defs>

        <g transform={`translate(${pan.x} ${pan.y})`}>
          <rect
            className="topology-pan-surface"
            x={vb.minX}
            y={vb.minY}
            width={vb.width}
            height={vb.height}
            onPointerDown={onPanSurfaceDown}
          />
          <rect
            x={vb.minX}
            y={vb.minY}
            width={vb.width}
            height={vb.height}
            fill={`url(#${gridPatternId})`}
            pointerEvents="none"
          />

          {edges.map((edge, index) => {
            const from = positions[edge.from];
            const to = positions[edge.to];
            if (!from || !to) return null;
            const key = edgeKey(edge.from, edge.to);
            const highlighted = connectedEdges.has(key);
            const pulseActive = showPulse && index === pulseIndex && !dragging;
            return (
              <g key={key}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  className={`hero-viz-edge topology-edge ${highlighted ? "is-highlight" : ""} ${pulseActive ? "is-active" : ""}`}
                  stroke={pulseActive ? `url(#${edgeGradId})` : undefined}
                />
                {pulseActive ? (
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

          {nodes.map((node, index) => {
            const pos = positions[node.id] ?? { x: node.x, y: node.y };
            const isSelected = selectedId === node.id;
            const isHot = highlightId === node.id;
            const radius = isSelected || isHot ? 5.4 : 4.2;
            return (
              <g
                key={node.id}
                id={`topology-node-${node.id}`}
                className={`topology-node-group ${isSelected ? "is-selected" : ""} ${isHot ? "is-hot" : ""}`}
                transform={`translate(${pos.x} ${pos.y})`}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${node.label}${node.detail ? `, ${node.detail}` : ""}`}
                onPointerDown={(event) => onNodeDown(node.id, event)}
                onPointerEnter={() => setHoverId(node.id)}
                onPointerLeave={() => setHoverId((current) => (current === node.id ? null : current))}
                onFocus={() => setFocusId(node.id)}
                onBlur={() => setFocusId((current) => (current === node.id ? null : current))}
                onKeyDown={(event) => onKeyDown(event, node.id, index)}
                onClick={(event) => {
                  event.stopPropagation();
                  if (dragMovedRef.current) {
                    dragMovedRef.current = false;
                    return;
                  }
                  setSelected(isSelected ? null : node.id);
                }}
                filter={`url(#${nodeGlowId})`}
              >
                <circle
                  r={radius + 6}
                  className="topology-node-hit"
                  fill="transparent"
                />
                <circle
                  r={radius}
                  className={`hero-viz-node hero-viz-node-${node.accent} ${isSelected || isHot ? "is-active" : ""}`}
                />
                <text y={12} textAnchor="middle" className="hero-viz-label">
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <div ref={liveRef} className="sr-only" aria-live="polite" />

      {footer}
    </div>
  );
}
