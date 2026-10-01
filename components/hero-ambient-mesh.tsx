/** Decorative hero motion layer — CSS-only, respects reduced motion via globals. */
export function HeroAmbientMesh() {
  return (
    <div className="hero-ambient-mesh" aria-hidden="true">
      <div className="hero-mesh-orb hero-mesh-orb-a" />
      <div className="hero-mesh-orb hero-mesh-orb-b" />
      <div className="hero-mesh-line" />
      <div className="hero-mesh-line hero-mesh-line-b" />
      <div className="hero-mesh-dust" />
    </div>
  );
}
