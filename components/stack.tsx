import { stack } from "@/lib/content";
import { Section, SectionHeading } from "@/components/section";

export function Stack() {
  return (
    <Section id="stack" labelledBy="stack-heading">
      <SectionHeading
        id="stack-heading"
        index="07"
        eyebrow="Technical stack"
        title="What the work is built with."
        lede="The case-study stack, plus the Innoart record: Angular 1–14, Three.js, Neo4j, MySQL, ClickHouse, OpenAPI, OAuth 2.0, Android, Xamarin Forms, and Cordova. Flutter remains with the mobile work."
      />

      <div className="mt-12">
        <table className="w-full border-t border-line text-left text-sm">
          <caption className="sr-only">Technical stack by area</caption>
          <thead>
            <tr className="border-b border-line">
              <th
                scope="col"
                className="w-40 py-3 pr-6 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-faint"
              >
                Area
              </th>
              <th
                scope="col"
                className="py-3 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-faint"
              >
                Technologies
              </th>
            </tr>
          </thead>
          <tbody>
            {stack.map((row) => (
              <tr key={row.area} className="border-b border-line">
                <th scope="row" className="w-[38%] py-3.5 pr-4 align-top font-medium text-ink sm:w-40 sm:pr-6">
                  {row.area}
                </th>
                <td className="py-3.5 align-top text-muted">{row.technologies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
