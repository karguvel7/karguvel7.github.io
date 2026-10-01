export function AmbientBackdrop() {
  return (
    <div className="ambient-backdrop galaxy-backdrop" aria-hidden="true">
      <div className="galaxy-deep" />
      <div className="galaxy-photo-stack">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG photo layers */}
        <img
          src="/galaxy/stars-dark-deep.svg"
          alt=""
          className="galaxy-photo galaxy-photo-stars galaxy-photo-stars-deep galaxy-theme-dark"
          decoding="async"
          fetchPriority="low"
        />
        <img
          src="/galaxy/stars-light-deep.svg"
          alt=""
          className="galaxy-photo galaxy-photo-stars galaxy-photo-stars-deep galaxy-theme-light"
          decoding="async"
          fetchPriority="low"
        />
        <img
          src="/galaxy/stars-dark.svg"
          alt=""
          className="galaxy-photo galaxy-photo-stars galaxy-photo-stars-mid galaxy-theme-dark"
          decoding="async"
          fetchPriority="low"
        />
        <img
          src="/galaxy/stars-light.svg"
          alt=""
          className="galaxy-photo galaxy-photo-stars galaxy-photo-stars-mid galaxy-theme-light"
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
        <img
          src="/galaxy/dust-dark.svg"
          alt=""
          className="galaxy-photo galaxy-photo-dust galaxy-theme-dark"
          decoding="async"
          fetchPriority="low"
        />
        <img
          src="/galaxy/dust-light.svg"
          alt=""
          className="galaxy-photo galaxy-photo-dust galaxy-theme-light"
          decoding="async"
          fetchPriority="low"
        />
        <img
          src="/galaxy/stars-dark-near.svg"
          alt=""
          className="galaxy-photo galaxy-photo-stars galaxy-photo-stars-near galaxy-theme-dark"
          decoding="async"
          fetchPriority="low"
        />
        <img
          src="/galaxy/stars-light-near.svg"
          alt=""
          className="galaxy-photo galaxy-photo-stars galaxy-photo-stars-near galaxy-theme-light"
          decoding="async"
          fetchPriority="low"
        />
      </div>
      <div className="galaxy-pointer-interaction" aria-hidden="true">
        <div className="galaxy-pointer-starlift galaxy-theme-dark" />
        <div className="galaxy-pointer-starlift galaxy-theme-light" />
        <div className="galaxy-pointer-dust-swirl" />
      </div>
      <div className="galaxy-content-veil" />
      <div className="galaxy-cinema-vignette" />
      <div className="grain-overlay galaxy-grain" />
    </div>
  );
}
