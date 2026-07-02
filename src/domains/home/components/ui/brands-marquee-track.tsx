'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useLocale } from 'next-intl';

import { getDirection, type Locale } from '@/i18n/config';

export type BrandsMarqueeItem = {
  key: string;
  name: string;
};

const MARQUEE_DURATION_SECONDS = 36;

const brandLabelClass =
  'text-muted-foreground/80 font-display shrink-0 text-lg font-medium tracking-wide whitespace-nowrap sm:text-xl';

/** Infinite horizontal brand marquee — GPU-friendly translateX loop. */
export function BrandsMarqueeTrack({ items }: { items: BrandsMarqueeItem[] }) {
  const prefersReducedMotion = useReducedMotion();
  const locale = useLocale() as Locale;
  const isRtl = getDirection(locale) === 'rtl';
  const loop = [...items, ...items];

  if (prefersReducedMotion) {
    return (
      <div className='flex flex-wrap items-center justify-center gap-x-12 gap-y-3 sm:gap-x-16'>
        {items.map((brand) => (
          <span key={brand.key} className={brandLabelClass}>
            {brand.name}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]'>
      <motion.div
        className='flex w-max gap-12 will-change-transform sm:gap-16'
        animate={{ x: isRtl ? ['0%', '50%'] : ['0%', '-50%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: MARQUEE_DURATION_SECONDS,
            ease: 'linear'
          }
        }}
      >
        {loop.map((brand, index) => (
          <span key={`${brand.key}-${index}`} className={brandLabelClass}>
            {brand.name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
