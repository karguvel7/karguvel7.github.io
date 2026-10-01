import { site } from "@/lib/content";

export function AvailabilityPill() {
  return (
    <p className="availability-pill inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
      <span>{site.availability}</span>
      <span className="text-muted" aria-hidden="true">
        ·
      </span>
      <span className="text-muted">{site.rolesNote}</span>
    </p>
  );
}
