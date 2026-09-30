import { expertise, systemShape } from "@/lib/content";
import { Pipeline } from "@/components/pipeline";
import { Section, SectionHeading } from "@/components/section";

export function Expertise() {
  return (
    <Section id="expertise" labelledBy="expertise-heading">
      <SectionHeading
        id="expertise-heading"
        index="02"
        eyebrow="Engineering expertise"
        title="The layers, end to end."
        lede="AI systems, cloud platforms, DevOps, and enterprise architecture, treated as one system."
      />

      <ol className="mt-12 grid border-t border-line sm:grid-cols-2">
        {expertise.map((item, index) => (
          <li
            key={item.title}
            className="border-b border-line py-6 sm:px-6 sm:odd:border-r sm:odd:pl-0 sm:even:pr-0"
          >
            <p className="font-mono text-[11px] text-faint">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 text-base font-medium text-ink">{item.title}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{item.detail}</p>
          </li>
        ))}
      </ol>

      <div className="mt-14 border border-line p-5 sm:p-6">
        <h3 className="text-sm font-medium text-ink">System shape</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          A system I work on moves through these stages. Each case study below lists only the
          stages that project documents.
        </p>
        <div className="mt-5">
          <Pipeline stages={systemShape} label="Typical system shape" />
        </div>
      </div>
    </Section>
  );
}
