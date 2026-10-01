export function AmbientBackdrop() {
  return (
    <div className="ambient-backdrop galaxy-backdrop" aria-hidden="true">
      <div className="galaxy-deep" />
      <div className="galaxy-photo-stack">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG photo layers */}
        <img
          src="/galaxy/stars-dark.svg"
          alt=""
          className="galaxy-photo galaxy-photo-stars galaxy-theme-dark"
          decoding="async"
          fetchPriority="low"
        />
        <img
          src="/galaxy/stars-light.svg"
          alt=""
          className="galaxy-photo galaxy-photo-stars galaxy-theme-light"
          decoding="async"
          fetchPriority="low"
        />
        <img
          src="/galaxy/milky-dark.svg"
          alt=""
          className="galaxy-photo galaxy-photo-milky galaxy-theme-dark"
          decoding="async"
          fetchPriority="low"
        />
        <img
          src="/galaxy/milky-light.svg"
          alt=""
          className="galaxy-photo galaxy-photo-milky galaxy-theme-light"
          decoding="async"
          fetchPriority="low"
        />
      </div>
      <div className="galaxy-pointer-interaction" aria-hidden="true">
        <div className="galaxy-pointer-starlift galaxy-theme-dark" />
        <div className="galaxy-pointer-starlift galaxy-theme-light" />
        <div className="galaxy-pointer-dust-swirl" />
      </div>
      <div className="galaxy-nebula-band galaxy-nebula-band-far" />
      <div className="galaxy-nebula-band galaxy-nebula-band-mid" />
      <div className="galaxy-nebula-band galaxy-nebula-band-near" />
      <div className="galaxy-nebula galaxy-nebula-a" />
      <div className="galaxy-nebula galaxy-nebula-b" />
      <div className="galaxy-nebula galaxy-nebula-c" />
      <div className="galaxy-nebula galaxy-nebula-d" />
      <div className="galaxy-cursor-well" />
      <div className="galaxy-content-veil" />
      <div className="ambient-orb ambient-orb-a" />
      <div className="ambient-orb ambient-orb-b" />
      <div className="ambient-orb ambient-orb-c" />
      <div className="ambient-orb ambient-orb-d" />
      <div className="ambient-grid-glow" />
      <div className="grain-overlay galaxy-grain" />
    </div>
  );
}
