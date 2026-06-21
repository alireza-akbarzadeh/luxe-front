'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { formatLocaleDecimal, formatLocaleNumber } from '@/lib/i18n/format-number';

interface UseAnimatedCounterOptions {
  end: number;
  duration?: number;
  decimals?: number;
  enabled?: boolean;
  locale: Locale;
}

function formatCounterValue(value: number, decimals: number, locale: Locale) {
  if (decimals > 0) {
    return formatLocaleDecimal(value, locale, decimals);
  }
  return formatLocaleNumber(Math.round(value), locale);
}

/** Animates a number when enabled (typically on scroll into view). */
export function useAnimatedCounter({
  end,
  duration = 1800,
  decimals = 0,
  enabled = true,
  locale
}: UseAnimatedCounterOptions) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    startTimeRef.current = null;
    let cancelled = false;

    const animate = (timestamp: number) => {
      if (cancelled) {
        return;
      }

      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setAnimatedValue(end * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [duration, enabled, end]);

  const value = enabled ? animatedValue : end;
  return formatCounterValue(value, decimals, locale);
}
