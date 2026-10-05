type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/** Runs `cb` after the load event once the main thread is idle; returns a canceller. */
export function afterLoadIdle(cb: () => void, timeout = 1200): () => void {
  const win = window as IdleWindow;
  let idleId = 0;
  let timer = 0;
  let done = false;

  const schedule = () => {
    if (done) return;
    if (win.requestIdleCallback) idleId = win.requestIdleCallback(run, { timeout });
    else timer = window.setTimeout(run, 200);
  };
  const run = () => {
    if (done) return;
    done = true;
    cb();
  };

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  return () => {
    done = true;
    window.removeEventListener("load", schedule);
    if (idleId && win.cancelIdleCallback) win.cancelIdleCallback(idleId);
    window.clearTimeout(timer);
  };
}
