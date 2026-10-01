import { GalaxyCanvas } from "@/components/galaxy-canvas";

export function AmbientBackdrop() {
  return (
    <div className="ambient-backdrop galaxy-backdrop" aria-hidden="true">
      <div className="galaxy-deep" />
      <GalaxyCanvas />
      <div className="galaxy-content-veil" />
      <div className="galaxy-cinema-vignette" />
      <div className="grain-overlay galaxy-grain" />
    </div>
  );
}
