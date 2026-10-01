/** Semantic accent tokens for architecture / observability UI (not content). */

export type Accent = "cyan" | "violet" | "amber" | "emerald" | "neutral";

export const sectionAccent: Record<string, Accent> = {
  about: "emerald",
  skills: "cyan",
  "building-with-ai": "violet",
  architecture: "cyan",
  experience: "amber",
  expertise: "cyan",
  systems: "violet",
  platform: "cyan",
  projects: "violet",
  stack: "cyan",
  workflow: "violet",
  lab: "violet",
  github: "neutral",
  contact: "emerald",
};

export const roleAccents: Accent[] = ["violet", "cyan", "emerald", "amber"];

/** Maps hero arc + system-shape order to layer colors. */
export const layerAccents: Accent[] = [
  "violet",
  "cyan",
  "cyan",
  "cyan",
  "emerald",
];

export const expertiseTileAccents: Accent[] = [
  "violet",
  "cyan",
  "cyan",
  "cyan",
  "cyan",
  "cyan",
  "cyan",
  "amber",
  "emerald",
  "emerald",
];

export function accentDataAttr(accent: Accent): { "data-accent": Accent } {
  return { "data-accent": accent };
}

/** Pipeline stage cycling when no single project accent is passed. */
export const pipelineStageAccents: Accent[] = ["violet", "cyan", "amber", "emerald"];

export const platformAreaAccents: Accent[] = ["cyan", "cyan", "amber", "emerald"];

export const workflowStepAccents: Accent[] = ["violet", "violet", "cyan", "emerald"];

export const stackRowAccent: Record<string, Accent> = {
  AI: "violet",
  Backend: "cyan",
  Frontend: "emerald",
  Cloud: "cyan",
  DevOps: "cyan",
  Databases: "cyan",
  Architecture: "violet",
  Observability: "amber",
  "AI dev tools": "violet",
  Mobile: "emerald",
  APIs: "cyan",
};
