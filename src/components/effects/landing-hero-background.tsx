'use client';

import { useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';

import { Spotlight } from '@/components/effects/spotlight';
import { cn } from '@/lib/utils';

const BackgroundBeams = dynamic(
  () => import('@/components/effects/background-beams').then((m) => m.BackgroundBeams),
  { ssr: false }
);

interface LandingHeroBackgroundProps {
  className?: string;
  spotlightClassName?: string;
}

/** Decorative hero layer — desktop only, respects reduced motion. */
export function LandingHeroBackground({
  className,
  spotlightClassName
}: LandingHeroBackgroundProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return null;
  }

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      <Spotlight
        className={cn('-top-40 left-0 md:-top-20 md:left-60', spotlightClassName)}
        fill='var(--gold)'
      />
      <div className='absolute inset-0 hidden lg:block'>
        <BackgroundBeams />
      </div>
    </div>
  );
}
