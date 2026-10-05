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
  /** Highlight driven from outside the map (e.g. hovering a linked card). */
  externalHoverId?: string | null;
  variant?: "hero" | "skills";
  showPulse?: boolean;
  footer?: ReactNode;
};

type Point = { x: number; y: number };

type DragState = {
  mode: "none" | "pan" | "node";
  pointerId: number;
  startClient: Point;
  startPan: Point;
  nodeId?: string;
  startNode?: Point;
  moved: boolean;
};

const DRAG_THRESHOLD_PX = 5;
const NODE_RADIUS = 4.2;
const NODE_RADIUS_ACTIVE = 5.4;
const EDGE_GAP = 1.4;

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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const IDLE_DRAG: DragState = {
  mode: "none",
  pointerId: -1,
  startClient: { x: 0, y: 0 },
  startPan: { x: 0, y: 0 },
  moved: false,
};

export function InteractiveTopology({
  viewBox,
  nodes,
  edges,
  ariaLabel,
  hint = "Drag nodes · pan empty space · tap a node for details",
  selectedId: selectedIdProp,
  onSelect,
  externalHoverId = null,
  variant = "hero",
  showPulse = false,
  footer,
}: InteractiveTopologyProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, SVGGElement>());
  const titleId = useId();
  const descId = useId();
  const uid = useId().replace(/:/g, "");
  const gridPatternId = `topologyDiagGrid-${uid}`;
  const edgeGradId = `topologyEdgeGrad-${uid}`;

  const initialPositions = useMemo(
    () => Object.fromEntries(nodes.map((node) => [node.id, { x: node.x, y: node.y }])),
    [nodes],
  );
  const [positions, setPositions] = useState<Record<string, Point>>(initialPositions);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const [pulseIndex, setPulseIndex] = useState(0);
  const [dragMode, setDragMode] = useState<DragState["mode"]>("none");
  const [grabbedId, setGrabbedId] = useState<string | null>(null);
  const dragRef = useRef<DragState>(IDLE_DRAG);

  const selectedId = selectedIdProp !== undefined ? selectedIdProp : internalSelected;
  const highlightId = hoverId ?? externalHoverId ?? focusId ?? selectedId;
  const vb = useMemo(() => parseViewBox(viewBox), [viewBox]);

  const setSelected = useCallback(
    (id: string | null) => {
      if (onSelect) onSelect(id);
      else setInternalSelected(id);
      const node = nodes.find((n) => n.id === id);
      if (liveRef.current) {
        liveRef.current.textContent = node
          ? `${node.label} selected${node.detail ? ` — ${node.detail}` : ""}`
          : "Selection cleared";
      }
    },
    [nodes, onSelect],
  );

  const connectedEdges = useMemo(() => {
    const set = new Set<string>();
    if (!highlightId) return set;
    edges.forEach((edge) => {
      if (edge.from === highlightId || edge.to === highlightId) set.add(edgeKey(edge.from, edge.to));
    });
    return set;
  }, [edges, highlightId]);

  const connectedNodes = useMemo(() => {
    const set = new Set<string>();
    if (!highlightId) return set;
    set.add(highlightId);
    edges.forEach((edge) => {
      if (edge.from === highlightId) set.add(edge.to);
      if (edge.to === highlightId) set.add(edge.from);
    });
    return set;
  }, [edges, highlightId]);

  useEffect(() => {
    if (!showPulse || document.documentElement.dataset.motion !== "on") return;
    const timer = window.setInterval(() => setPulseIndex((value) => (value + 1) % edges.length), 1400);
    return () => window.clearInterval(timer);
  }, [edges.length, showPulse]);

  /** Converts a client-space delta into viewBox units, honouring preserveAspectRatio letterboxing. */
  const toViewBoxDelta = useCallback((dxClient: number, dyClient: number): Point => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix || matrix.a === 0 || matrix.d === 0) return { x: 0, y: 0 };
    return { x: dxClient / matrix.a, y: dyClient / matrix.d };
  }, []);

  const endDrag = useCallback(
    (event?: ReactPointerEvent<SVGSVGElement>) => {
      const drag = dragRef.current;
      if (drag.mode === "none") return;
      if (event && drag.pointerId !== event.pointerId) return;
      const svg = svgRef.current;
      if (svg?.hasPointerCapture?.(drag.pointerId)) svg.releasePointerCapture(drag.pointerId);

      const wasTap = !drag.moved && event?.type === "pointerup";
      const tappedNode = drag.mode === "node" ? drag.nodeId : undefined;
      dragRef.current = IDLE_DRAG;
      setDragMode("none");
      setGrabbedId(null);

      if (wasTap && tappedNode) setSelected(selectedId === tappedNode ? null : tappedNode);
    },
    [selectedId, setSelected],
  );

  const beginDrag = (
    mode: "pan" | "node",
    event: ReactPointerEvent<SVGElement>,
    nodeId?: string,
  ) => {
    if (event.button !== 0) return;
    const svg = svgRef.current;
    if (!svg) return;
    dragRef.current = {
      mode,
      pointerId: event.pointerId,
      startClient: { x: event.clientX, y: event.clientY },
      startPan: { ...pan },
      nodeId,
      startNode: nodeId ? { ...positions[nodeId] } : undefined,
      moved: false,
    };
    svg.setPointerCapture(event.pointerId);
    setDragMode(mode);
    setGrabbedId(nodeId ?? null);
    if (mode === "node") {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (drag.mode === "none" || drag.pointerId !== event.pointerId) return;

    const dxClient = event.clientX - drag.startClient.x;
    const dyClient = event.clientY - drag.startClient.y;
    if (!drag.moved && Math.hypot(dxClient, dyClient) < DRAG_THRESHOLD_PX) return;
    drag.moved = true;
    const delta = toViewBoxDelta(dxClient, dyClient);

    if (drag.mode === "pan") {
      const limitX = vb.width * 0.22;
      const limitY = vb.height * 0.22;
      setPan({
        x: clamp(drag.startPan.x + delta.x, -limitX, limitX),
        y: clamp(drag.startPan.y + delta.y, -limitY, limitY),
      });
      return;
    }

    if (drag.mode === "node" && drag.nodeId && drag.startNode) {
      const margin = 7;
      const id = drag.nodeId;
      const start = drag.startNode;
      setPositions((prev) => ({
        ...prev,
        [id]: {
          x: clamp(start.x + delta.x, vb.minX + margin - pan.x, vb.minX + vb.width - margin - pan.x),
          y: clamp(start.y + delta.y, vb.minY + margin - pan.y, vb.minY + vb.height - margin * 1.6 - pan.y),
        },
      }));
    }
  };

  const focusNodeAt = (index: number) => {
    const next = nodes[(index + nodes.length) % nodes.length];
    nodeRefs.current.get(next.id)?.focus();
  };

  const nudgeNode = (nodeId: string, dx: number, dy: number) => {
    const margin = 7;
    setPositions((prev) => {
      const current = prev[nodeId];
      if (!current) return prev;
      return {
        ...prev,
        [nodeId]: {
          x: clamp(current.x + dx, vb.minX + margin - pan.x, vb.minX + vb.width - margin - pan.x),
          y: clamp(current.y + dy, vb.minY + margin - pan.y, vb.minY + vb.height - margin * 1.6 - pan.y),
        },
      };
    });
  };

  const onKeyDown = (event: KeyboardEvent<SVGGElement>, nodeId: string, index: number) => {
    if (event.shiftKey && event.key.startsWith("Arrow")) {
      event.preventDefault();
      const step = 3;
      if (event.key === "ArrowLeft") nudgeNode(nodeId, -step, 0);
      if (event.key === "ArrowRight") nudgeNode(nodeId, step, 0);
      if (event.key === "ArrowUp") nudgeNode(nodeId, 0, -step);
      if (event.key === "ArrowDown") nudgeNode(nodeId, 0, step);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelected(selectedId === nodeId ? null : nodeId);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setSelected(null);
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusNodeAt(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusNodeAt(index - 1);
    }
  };

  const resetLayout = () => {
    setPan({ x: 0, y: 0 });
    setPositions(initialPositions);
    setSelected(null);
  };

  const heightClass = variant === "skills" ? "topology-canvas-skills" : "topology-canvas-hero";
  const radiusOf = (id: string) => (selectedId === id || highlightId === id ? NODE_RADIUS_ACTIVE : NODE_RADIUS);

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
        preserveAspectRatio="xMidYMid meet"
        className={`diagram-canvas topology-canvas ${heightClass} ${dragMode !== "none" ? "is-dragging" : ""} ${
          highlightId ? "has-highlight" : ""
        }`}
        role="group"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        <title id={titleId}>{ariaLabel}</title>
        <desc id={descId}>
          {hint}. Keyboard: arrow keys move between nodes, Shift+arrow moves the focused node, Enter or Space
          selects, Escape clears.
        </desc>
        <defs>
          <linearGradient id={edgeGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(var(--accent-cyan-rgb))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="rgb(var(--accent-violet-rgb))" stopOpacity="0.45" />
            <stop offset="100%" stopColor="rgb(var(--accent-cyan-rgb))" stopOpacity="0.2" />
          </linearGradient>
          <pattern id={gridPatternId} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" className="hero-viz-grid-line" strokeWidth="0.25" />
          </pattern>
        </defs>

        <rect
          className="topology-pan-surface"
          x={vb.minX - vb.width}
          y={vb.minY - vb.height}
          width={vb.width * 3}
          height={vb.height * 3}
          onPointerDown={(event) => beginDrag("pan", event)}
        />

        <g transform={`translate(${pan.x} ${pan.y})`} className="topology-world">
          <rect
            x={vb.minX - vb.width}
            y={vb.minY - vb.height}
            width={vb.width * 3}
            height={vb.height * 3}
            fill={`url(#${gridPatternId})`}
            pointerEvents="none"
          />

          <g className="topology-edges" pointerEvents="none">
            {edges.map((edge, index) => {
              const from = positions[edge.from];
              const to = positions[edge.to];
              if (!from || !to) return null;
              const dist = Math.hypot(to.x - from.x, to.y - from.y) || 1;
              const ux = (to.x - from.x) / dist;
              const uy = (to.y - from.y) / dist;
              const startGap = radiusOf(edge.from) + EDGE_GAP;
              const endGap = radiusOf(edge.to) + EDGE_GAP;
              if (dist <= startGap + endGap) return null;
              const x1 = from.x + ux * startGap;
              const y1 = from.y + uy * startGap;
              const x2 = to.x - ux * endGap;
              const y2 = to.y - uy * endGap;
              const key = edgeKey(edge.from, edge.to);
              const highlighted = connectedEdges.has(key);
              const pulseActive = showPulse && index === pulseIndex && dragMode === "none";
              return (
                <g key={key}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className={`hero-viz-edge topology-edge ${highlighted ? "is-highlight" : ""} ${pulseActive ? "is-active" : ""}`}
                    stroke={pulseActive ? `url(#${edgeGradId})` : undefined}
                  />
                  {pulseActive ? (
                    <circle r="1.1" className="hero-viz-packet">
                      <animateMotion dur="1.4s" repeatCount="1" path={`M ${x1} ${y1} L ${x2} ${y2}`} />
                    </circle>
                  ) : null}
                </g>
              );
            })}
          </g>

          {nodes.map((node, index) => {
            const pos = positions[node.id] ?? { x: node.x, y: node.y };
            const isSelected = selectedId === node.id;
            const isHot = highlightId === node.id;
            const isLinked = connectedNodes.has(node.id);
            const radius = radiusOf(node.id);
            return (
              <g
                key={node.id}
                ref={(el) => {
                  if (el) nodeRefs.current.set(node.id, el);
                  else nodeRefs.current.delete(node.id);
                }}
                data-node-id={node.id}
                className={`topology-node-group ${isSelected ? "is-selected" : ""} ${isHot ? "is-hot" : ""} ${
                  isLinked ? "is-linked" : ""
                } ${grabbedId === node.id ? "is-grabbed" : ""}`}
                transform={`translate(${pos.x} ${pos.y})`}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${node.label}${node.detail ? `, ${node.detail}` : ""}`}
                onPointerDown={(event) => beginDrag("node", event, node.id)}
                onPointerEnter={() => setHoverId(node.id)}
                onPointerLeave={() => setHoverId((current) => (current === node.id ? null : current))}
                onFocus={() => setFocusId(node.id)}
                onBlur={() => setFocusId((current) => (current === node.id ? null : current))}
                onKeyDown={(event) => onKeyDown(event, node.id, index)}
              >
                <circle r={radius + 5} className="topology-node-hit" />
                <circle r={radius + 2.2} className="topology-node-ring" />
                <circle
                  r={radius}
                  className={`hero-viz-node hero-viz-node-${node.accent} ${isSelected || isHot ? "is-active" : ""}`}
                />
                <text y={radius + 5.2} textAnchor="middle" className="hero-viz-label topology-label">
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
