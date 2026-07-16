'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

const highlight =
  'radial-gradient(75% 180% at 50% 50%, var(--gold) 0%, rgba(255, 255, 255, 0) 100%)';

const idleBorder =
  'radial-gradient(20.7% 50% at 50% 0%, var(--gold) 0%, rgba(255, 255, 255, 0) 100%)';

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = 'button',
  duration = 0.8,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
    href?: string;
  } & React.HTMLAttributes<HTMLElement>
>) {
  // SSR-safe: server snapshot is always false so markup matches hydration.
  const reduceMotion = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);

  const setHover = (next: boolean) => {
    if (reduceMotion) return;
    setHovered(next);
  };

  return (
    <Tag
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={cn(
        'relative inline-flex h-min w-fit items-center justify-center overflow-visible rounded-full p-px',
        containerClassName
      )}
      {...props}
    >
      <motion.div
        className='absolute inset-0 rounded-[inherit]'
        style={{ filter: 'blur(2px)', background: idleBorder }}
        animate={reduceMotion ? undefined : { background: hovered ? highlight : idleBorder }}
        transition={{ ease: 'linear', duration }}
        aria-hidden
      />
      <div
        className={cn(
          'bg-primary text-primary-foreground relative z-10 rounded-[inherit] px-8 py-3 text-sm font-medium',
          className
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
