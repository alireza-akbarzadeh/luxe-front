'use client';

import { motion, type MotionProps } from 'framer-motion';
import type { ComponentType, CSSProperties } from 'react';
import { memo, useMemo } from 'react';

import { cn } from '@/lib/utils';

type ShimmerElement = 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span';

type MotionTextProps = MotionProps & {
  className?: string;
  children?: string;
  style?: CSSProperties;
};

/** Stable motion primitives — never call `motion.create()` during render. */
const MOTION_ELEMENTS: Record<ShimmerElement, ComponentType<MotionTextProps>> = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span
};

export interface TextShimmerProps {
  children: string;
  as?: ShimmerElement;
  className?: string;
  duration?: number;
  spread?: number;
}

const ShimmerComponent = ({
  children,
  as = 'p',
  className,
  duration = 2,
  spread = 2
}: TextShimmerProps) => {
  const MotionComponent = MOTION_ELEMENTS[as];

  const dynamicSpread = useMemo(() => (children?.length ?? 0) * spread, [children, spread]);

  return (
    <MotionComponent
      animate={{ backgroundPosition: '0% center' }}
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent',
        '[background-repeat:no-repeat,padding-box] [--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage:
            'var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))'
        } as CSSProperties
      }
      transition={{
        duration,
        ease: 'linear',
        repeat: Number.POSITIVE_INFINITY
      }}
    >
      {children}
    </MotionComponent>
  );
};

export const Shimmer = memo(ShimmerComponent);
