import { talkingPortfolio } from "@/lib/content";

function PlayMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" fill="none" className="talking-portfolio-play">
      <circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <path d="M9 7.2v7.6l6.2-3.8L9 7.2z" fill="currentColor" />
    </svg>
  );
}

export function TalkingPortfolioCta() {
  return (
    <aside
      className="talking-portfolio-cta diagram-surface mt-10"
      data-accent="violet"
      aria-labelledby="talking-portfolio-heading"
    >
      <div className="diagram-surface-header">
        <span className="diagram-status" data-accent="violet">{talkingPortfolio.eyebrow}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Same domain</span>
      </div>

      <div className="talking-portfolio-cta-body grid gap-5 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:p-6">
        <div className="talking-portfolio-cta-icon flex h-12 w-12 items-center justify-center rounded-sm border border-line/60 bg-canvas/40 text-ink">
          <PlayMark />
        </div>

        <div className="min-w-0">
          <h3 id="talking-portfolio-heading" className="text-base font-medium tracking-tight text-ink">
            {talkingPortfolio.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{talkingPortfolio.lede}</p>
        </div>

        <a
          href={talkingPortfolio.href}
          className="btn-secondary btn-secondary-accent talking-portfolio-cta-link inline-flex h-11 w-full items-center justify-center border border-line px-4 text-sm font-medium text-ink sm:w-auto sm:min-w-[11rem]"
        >
          {talkingPortfolio.cta}
        </a>
      </div>
    </aside>
  );
}
