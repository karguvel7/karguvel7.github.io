"use client";

import { useState } from "react";

export function InteractivePipeline({
  stages,
  label = "Architecture flow",
}: {
  stages: readonly string[];
  label?: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2" aria-label={label}>
      {stages.map((stage, index) => (
        <li key={stage} className="flex items-center gap-1.5">
          <button
            type="button"
            className={`pipeline-stage border bg-canvas px-2.5 py-1 font-mono text-[11px] tracking-wide ${active === index ? "pipeline-stage-active" : "text-muted"}`}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
          >
            {stage}
          </button>
          {index < stages.length - 1 ? (
            <span
              aria-hidden="true"
              className={`pipeline-arrow px-0.5 ${index === active ? "pipeline-arrow-active" : "text-faint"}`}
            >
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
