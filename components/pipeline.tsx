export function Pipeline({
  stages,
  label = "Architecture flow",
}: {
  stages: readonly string[];
  label?: string;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2" aria-label={label}>
      {stages.map((stage, index) => (
        <li key={stage} className="flex items-center gap-1.5">
          <span className="border border-line bg-canvas px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted pipeline-stage">
            {stage}
          </span>
          {index < stages.length - 1 ? (
            <span aria-hidden="true" className="pipeline-arrow px-0.5 text-faint">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
