'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import type { Locale } from '@/i18n/config';
import { formatLocaleDecimal, formatLocaleNumber } from '@/lib/i18n/format-number';

import { useAnimatedCounter } from '../../hooks/use-animated-counter';

function formatStatic(value: number, decimals: number, locale: Locale) {
  if (decimals > 0) {
    return formatLocaleDecimal(value, locale, decimals);
  }
  return formatLocaleNumber(Math.round(value), locale);
}

interface AnimatedStatProps {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
  locale: Locale;
}

/** Client island — animated counters only (stats shell is server-rendered). */
export function AnimatedStat({
  value,
  suffix,
  label,
  decimals = 0,
  locale
}: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const display = useAnimatedCounter({
    end: value,
    decimals,
    enabled: inView && !reduceMotion,
    locale
  });
  const formatted = reduceMotion ? formatStatic(value, decimals, locale) : display;

  return (
    <div ref={ref} className='text-center'>
      <p className='font-display text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl'>
        {formatted}
        {suffix}
      </p>
      <p className='text-muted-foreground mt-2 text-sm'>{label}</p>
    </div>
  );
}
