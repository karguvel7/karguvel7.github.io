"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const title = "Let's build something together.".split(" ");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="section-pad border-t border-line">
      <div className="shell text-center">
        <p className="section-tag rv">06 — Contact</p>
        <h2 className="rv mt-6 text-[clamp(2rem,6vw,4rem)] font-bold leading-tight tracking-[-0.045em]">
          {title.map((word, i) => (
            <span
              key={i}
              className="inline-block hover:-translate-y-1 transition-transform"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {word}{" "}
            </span>
          ))}
        </h2>
        <a
          href={`mailto:${PROFILE.email}`}
          className="mt-8 inline-block text-[clamp(1.4rem,4vw,2.4rem)] font-bold text-ink underline decoration-1 underline-offset-8"
        >
          {PROFILE.email}
        </a>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button type="button" className="pill" onClick={copyEmail}>
            <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
          </button>
          <a className="pill" href={`tel:${PROFILE.phoneTel}`}>{PROFILE.phone}</a>
          <a className="pill" href={PROFILE.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </div>
        <div
          className="mx-auto mt-12 grid h-24 w-24 place-items-center rounded-full border border-line bg-card text-xs font-mono uppercase tracking-widest text-mute animate-spin-slow"
          aria-hidden
        >
          say hello
        </div>
      </div>
      <footer className="shell mt-20 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-sm text-mute md:flex-row">
        <p>© {new Date().getFullYear()} {PROFILE.name}</p>
        <button
          type="button"
          className="pill"
          onClick={() => scrollToTarget("#hero", 0)}
        >
          Back to top
        </button>
        <p>Built with Next.js</p>
      </footer>
    </section>
  );
}
