"use client";

import { useEffect, useState } from "react";
import { sectionAccent } from "@/lib/accents";
import { aiCapabilities, aiFlowStages, aiInPractice } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";

const flowAccents = ["emerald", "violet", "violet", "cyan", "amber", "cyan"] as const;

export function BuildingWithAI() {
  const accent = sectionAccent["building-with-ai"];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (document.documentElement.dataset.motion !== "on") return;
    const timer = window.setInterval(() => {
      setActive((v) => (v + 1) % aiFlowStages.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <Section id="building-with-ai" labelledBy="building-ai-heading" accent={accent}>
      <SectionHeading
        id="building-ai-heading"
        index="03"
        eyebrow="Building with AI"
        accent={accent}
        title="LLMs, agents, and copilots in production."
        lede="Multi-agent orchestration, streaming, voice, tool calling, RAG, and agentic workflows — the same patterns documented in the case studies below."
      />

      <div className="mt-12 glass-panel overflow-x-auto p-4 sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Agent flow</p>
        <ol className="ai-flow mt-4 flex min-w-[36rem] items-stretch gap-1">
          {aiFlowStages.map((stage, index) => {
            const stageAccent = flowAccents[index] ?? "violet";
            const isActive = index === active;
            return (
              <li key={stage.id} className="flex flex-1 items-center gap-1">
                <button
                  type="button"
                  data-accent={stageAccent}
                  className={`ai-flow-node ${isActive ? "is-active" : ""}`}
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                >
                  <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block text-sm font-medium text-ink">{stage.label}</span>
                  <span className="mt-1 block text-xs leading-snug text-muted">{stage.detail}</span>
                </button>
                {index < aiFlowStages.length - 1 ? (
                  <span className="ai-flow-connector" data-accent={stageAccent} aria-hidden="true">
                    <span className={`ai-flow-packet ${isActive ? "is-running" : ""}`} data-accent={stageAccent} />
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <ul className="divide-y divide-line border-y border-line lg:col-span-7">
          {aiCapabilities.map((item) => (
            <li key={item.name} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <h3 className="text-sm font-medium text-ink">{item.name}</h3>
              <p className="text-sm leading-relaxed text-muted">{item.detail}</p>
            </li>
          ))}
        </ul>

        <div data-accent={accent} className="panel-accent-rail lg:col-span-5 p-5 sm:p-6">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">In production</h3>
          <ul className="mt-4 space-y-5">
            {aiInPractice.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="group block">
                  <span className="text-sm font-medium text-ink group-hover:underline">{item.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{item.detail}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
