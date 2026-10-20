import { site } from "@/lib/content";

export function AvailabilityPill() {
  return (
    <p className="availability-pill text-sm text-muted">
      <span>{site.location}</span>
    </p>
  );
}
