"use client";

import { useEffect, useRef, useState } from "react";

type Options = IntersectionObserverInit & { once?: boolean };

export function useInView<T extends Element>(
  options: Options = {},
): [React.RefObject<T | null>, boolean] {
  const { once = true, root = null, rootMargin, threshold } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) observer.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { root, rootMargin, threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, root, rootMargin, threshold]);

  return [ref, inView];
}
