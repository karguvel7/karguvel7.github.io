"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/data";

export function WorkSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="work" className="section-pad border-t border-line">
      <div className="shell">
        <p className="section-tag rv">04 — Selected work</p>
        <h2 className="rv mt-4 text-4xl font-bold tracking-[-0.045em] md:text-5xl">
          Projects <span className="heading-serif-end">gallery</span>
        </h2>

        <div className="mt-10 hidden min-h-[420px] gap-2 md:flex">
          {PROJECTS.map((project, i) => {
            const isOpen = open === i;
            return (
              <article
                key={project.id}
                className={`card relative flex overflow-hidden transition-[flex] duration-700 ease-[var(--ease)] ${
                  isOpen ? "flex-[8]" : "flex-[1] cursor-pointer"
                }`}
                onClick={() => setOpen(i)}
              >
                {!isOpen && (
                  <div className="flex h-full w-full flex-col items-center justify-between py-6">
                    <span className="font-mono text-sm text-mute">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p
                      className="text-sm font-bold [writing-mode:vertical-rl] rotate-180"
                    >
                      {project.title}
                    </p>
                    <span className="text-xl">+</span>
                  </div>
                )}
                {isOpen && (
                  <div className="grid flex-1 gap-6 p-8 lg:grid-cols-2">
                    <div>
                      <h3 className="text-2xl font-bold">{project.title}</h3>
                      <p className="mt-3 text-ink-2">{project.summary}</p>
                      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-2">
                        {project.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-line px-3 py-1 text-xs font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {project.href && (
                        <a
                          className="pill mt-6 inline-flex"
                          href={project.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View on GitHub ↗
                        </a>
                      )}
                    </div>
                    <MiniUi variant={project.uiVariant} />
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-10 space-y-3 md:hidden">
          {PROJECTS.map((project, i) => {
            const isOpen = open === i;
            return (
              <article key={project.id} className="card overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="font-bold">{project.title}</span>
                  <span className="text-xl">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-line px-5 pb-5 pt-3">
                    <p className="text-ink-2">{project.summary}</p>
                    {project.href && (
                      <a className="pill mt-4 inline-flex" href={project.href}>
                        View on GitHub ↗
                      </a>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MiniUi({ variant }: { variant: "cli" | "platform" | "incident" }) {
  return (
    <div className="relative">
      <p className="mb-2 font-mono text-xs text-mute">Illustrative UI</p>
      <div className="card overflow-hidden bg-[#faf9f7] p-4 grayscale">
        <div
          className="rv-mask h-48 rounded-xl border border-line bg-white p-3"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          {variant === "cli" && (
            <pre className="font-mono text-[10px] text-ink-2">
              $ specguard check --base openapi/v1.yaml --head openapi/v2.yaml
              {"\n"}✖ breaking: removed GET /users/{"{id}"}
            </pre>
          )}
          {variant === "platform" && (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 rounded bg-soft" />
              ))}
            </div>
          )}
          {variant === "incident" && (
            <div className="space-y-2">
              <div className="h-3 w-2/3 rounded bg-soft" />
              <div className="h-3 w-full rounded bg-soft" />
              <div className="h-3 w-5/6 rounded bg-soft" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
