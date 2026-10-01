"use client";

import { useEffect, useState } from "react";
import { layerAccents } from "@/lib/accents";
import { systemShape } from "@/lib/content";

export function SystemFlowLive() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (document.documentElement.dataset.motion !== "on") return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % systemShape.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="system-flow-live mt-5" aria-label="Animated system shape">
      <ol className="relative flex flex-wrap items-center gap-2">
        {systemShape.map((stage, index) => {
          const accent = layerAccents[index] ?? "neutral";
          return (
            <li key={stage} className="flex items-center gap-2">
              <button
                type="button"
                data-accent={accent}
                className={`system-flow-node ${index === active ? "is-active" : ""}`}
                onClick={() => setActive(index)}
                aria-pressed={index === active}
              >
                {stage}
              </button>
              {index < systemShape.length - 1 ? (
                <span className="system-flow-connector" data-accent={accent} aria-hidden="true">
                  <span
                    data-accent={accent}
                    className={`system-flow-packet ${index === active ? "is-running" : ""}`}
                  />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
