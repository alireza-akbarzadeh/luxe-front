import { useCallback, useEffect, useState } from 'react';

import type { CarouselApi } from '@/components/ui/carousel';

type UseCarouselStateReturn = {
  /** Pass this to the `setApi` prop of the shadcn `<Carousel>` component */
  setApi: (api: CarouselApi) => void;
  /** Index of the currently visible snap (0-based) */
  current: number;
  /** Total number of scroll snaps */
  count: number;
  /** Scroll to a specific snap index */
  scrollTo: (index: number) => void;
  /** Scroll to the previous snap */
  scrollPrev: () => void;
  /** Scroll to the next snap */
  scrollNext: () => void;
  /** Whether the carousel can scroll backwards */
  canScrollPrev: boolean;
  /** Whether the carousel can scroll forwards */
  canScrollNext: boolean;
};

export function useCarouselState(): UseCarouselStateReturn {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    setCount(api.scrollSnapList().length);
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!api) return;
    requestAnimationFrame(() => {
      onSelect(api);
    });
    api.on('reInit', onSelect);
    api.on('select', onSelect);
    return () => {
      api.off('reInit', onSelect);
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);
  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  return {
    setApi,
    current,
    count,
    scrollTo,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext
  };
}
