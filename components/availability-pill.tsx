import { site } from "@/lib/content";

export function AvailabilityPill() {
  return (
    <p className="availability-pill inline-flex items-center gap-2 text-sm text-muted">
      <span className="status-dot shrink-0" data-accent="emerald" aria-hidden="true" />
      <span>{site.availability}</span>
      <span className="text-muted" aria-hidden="true">
        ·
      </span>
      <span className="text-muted">{site.rolesNote}</span>
    </p>
  );
}
