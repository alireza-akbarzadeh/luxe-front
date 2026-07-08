'use client';

import { useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const DottedGlowBackground = dynamic(
  () => import('@/components/effects/dotted-glow-background').then((m) => m.DottedGlowBackground),
  { ssr: false }
);

interface LandingCtaShellProps {
  children: ReactNode;
  className?: string;
}

/** Below-fold CTA card with optional dotted glow canvas. */
export function LandingCtaShell({ children, className }: LandingCtaShellProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        'border-border/50 from-gold/15 via-gold/5 to-card/40 relative overflow-hidden rounded-[2rem] border bg-gradient-to-br px-6 py-16 text-center md:px-12 md:py-20',
        className
      )}
    >
      {!reduceMotion ? (
        <DottedGlowBackground
          gap={14}
          radius={1.5}
          color='rgba(201, 169, 110, 0.25)'
          darkColor='rgba(232, 213, 183, 0.2)'
          glowColor='rgba(201, 169, 110, 0.5)'
          darkGlowColor='rgba(232, 213, 183, 0.45)'
          opacity={0.45}
          speedMin={0.2}
          speedMax={0.6}
          speedScale={0.7}
        />
      ) : null}
      <div
        aria-hidden
        className='bg-gold/20 pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl'
      />
      <div className='relative'>{children}</div>
    </div>
  );
}
