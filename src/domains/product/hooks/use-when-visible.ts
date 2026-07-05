'use client';

import { useEffect, useRef, useState } from 'react';

type UseWhenVisibleOptions = {
  /** Start loading before the element fully enters the viewport. */
  rootMargin?: string;
  /** Intersection ratio threshold (0–1). */
  threshold?: number;
};

/**
 * Fires once when the observed element intersects the viewport.
 * Used to defer PDP insight API calls until the shopper scrolls near the section.
 */
export function useWhenVisible<T extends HTMLElement = HTMLElement>({
  rootMargin = '200px 0px',
  threshold = 0
}: UseWhenVisibleOptions = {}) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [visible, rootMargin, threshold]);

  return { ref, visible };
}
