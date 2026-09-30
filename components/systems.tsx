import { aiCapabilities, aiInPractice } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";

export function Systems() {
  return (
    <Section id="systems" labelledBy="systems-heading">
      <SectionHeading
        id="systems-heading"
        index="03"
        eyebrow="AI and agentic systems"
        title="Application engineering for models, agents, and copilots."
        lede="The AI work is systems that call models, orchestrate agents, stream output, and sit inside real products."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <ul className="divide-y divide-line border-y border-line lg:col-span-7">
          {aiCapabilities.map((item) => (
            <li key={item.name} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <h3 className="text-sm font-medium text-ink">{item.name}</h3>
              <p className="text-sm leading-relaxed text-muted">{item.detail}</p>
            </li>
          ))}
        </ul>

        <div className="lg:col-span-5">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            In the work
          </h3>
          <ul className="mt-4 space-y-5">
            {aiInPractice.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="group block">
                  <span className="text-sm font-medium text-ink group-hover:underline">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {item.detail}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
