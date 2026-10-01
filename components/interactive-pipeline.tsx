"use client";

import { useState } from "react";
import type { Accent } from "@/lib/accents";
import { pipelineStageAccents } from "@/lib/accents";

export function InteractivePipeline({
  stages,
  label = "Architecture flow",
  accent,
}: {
  stages: readonly string[];
  label?: string;
  accent?: Accent;
}) {
  const [active, setActive] = useState(0);

  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2" aria-label={label}>
      {stages.map((stage, index) => {
        const stageAccent = accent ?? pipelineStageAccents[index % pipelineStageAccents.length];
        const isActive = active === index;
        return (
          <li key={stage} className="flex items-center gap-1.5">
            <button
              type="button"
              data-accent={stageAccent}
              className={`pipeline-stage border bg-canvas px-2.5 py-1 font-mono text-[11px] tracking-wide ${isActive ? "pipeline-stage-active" : "text-muted"}`}
              onClick={() => setActive(index)}
              aria-pressed={isActive}
            >
              {stage}
            </button>
            {index < stages.length - 1 ? (
              <span
                aria-hidden="true"
                data-accent={stageAccent}
                className={`pipeline-arrow px-0.5 ${isActive ? "pipeline-arrow-active" : "text-faint"}`}
              >
                →
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
