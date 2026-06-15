'use client';

import { useEffect, useRef } from 'react';

interface InfiniteScrollSentinelProps {
  enabled: boolean;
  onIntersect: () => void;
  rootMargin?: string;
}

/** Observes viewport intersection to trigger the next infinite-query page fetch. */
export function InfiniteScrollSentinel({
  enabled,
  onIntersect,
  rootMargin = '480px'
}: InfiniteScrollSentinelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, onIntersect, rootMargin]);

  return <div ref={ref} className='h-px w-full' aria-hidden />;
}
