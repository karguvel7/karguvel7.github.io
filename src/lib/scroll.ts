import type Lenis from "lenis";

let lenisRef: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisRef = instance;
}

export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const el =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : target;
  if (!el) return;
  if (lenisRef) {
    lenisRef.scrollTo(el, { offset });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}
