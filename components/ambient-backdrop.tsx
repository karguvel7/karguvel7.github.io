import { DaylightSky } from "@/components/daylight-sky";
import { GalaxyCanvas } from "@/components/galaxy-canvas";

export function AmbientBackdrop() {
  return (
    <div className="ambient-backdrop galaxy-backdrop" aria-hidden="true">
      <div className="galaxy-deep" />
      <GalaxyCanvas />
      <DaylightSky />
      <div className="galaxy-content-veil" />
      <div className="galaxy-cinema-vignette" />
      <div className="grain-overlay galaxy-grain" />
    </div>
  );
}
