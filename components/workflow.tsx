import { sectionAccent, workflowStepAccents } from "@/lib/accents";
import { workflowSteps } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";

export function Workflow() {
  const accent = sectionAccent.workflow;
  return (
    <Section id="workflow" labelledBy="workflow-heading" accent={accent}>
      <SectionHeading
        id="workflow-heading"
        index="08"
        eyebrow="AI engineering workflow"
        accent={accent}
        title="Specification, then implementation."
        lede="Cursor, Claude, and Spec Kit are how I move from a written spec to code."
      />

      <ol className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {workflowSteps.map((step, index) => {
          const stepAccent = workflowStepAccents[index] ?? accent;
          return (
            <li
              key={step.title}
              data-accent={stepAccent}
              className="workflow-step expertise-tile bg-canvas p-5 sm:p-6"
            >
              <p className="font-mono text-[11px] text-faint">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 text-base font-medium text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.detail}</p>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 text-sm text-muted">
        The same practice is written up as{" "}
        <a
          href="#ai-developer-productivity"
          className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
        >
          AI Developer Productivity
        </a>
        .
      </p>
    </Section>
  );
}
