'use client';

import { useReducedMotion } from 'framer-motion';
import { useSyncExternalStore } from 'react';

import { Highlight } from '@/components/effects/hero-highlight';
import { cn } from '@/lib/utils';

interface HeroAccentHighlightProps {
  children: React.ReactNode;
  className?: string;
}

function subscribeNoop() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

/** Animated gold underline on hero accent — desktop only to protect mobile LCP. */
export function HeroAccentHighlight({ children, className }: HeroAccentHighlightProps) {
  const reduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);

  if (!mounted || reduceMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <>
      <span className={cn(className, 'lg:hidden')}>{children}</span>
      <span className='hidden lg:inline'>
        <Highlight className={className}>{children}</Highlight>
      </span>
    </>
  );
}
