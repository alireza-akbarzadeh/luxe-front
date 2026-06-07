// components/ui/box.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { applySpacing } from '@/components/theme/helper';
import { type SpacingKey } from '@/components/theme/spacing';
import { Slot } from '@/components/ui/slot';
import { cn } from '@/lib/utils';

const boxVariants = cva('block', {
  variants: {
    display: {
      block: 'block',
      'inline-block': 'inline-block',
      inline: 'inline',
      flex: 'flex',
      'inline-flex': 'inline-flex',
      grid: 'grid',
      'inline-grid': 'inline-grid',
      none: 'hidden'
    },
    position: {
      static: 'static',
      fixed: 'fixed',
      absolute: 'absolute',
      relative: 'relative',
      sticky: 'sticky'
    },
    overflow: {
      auto: 'overflow-auto',
      hidden: 'overflow-hidden',
      visible: 'overflow-visible',
      scroll: 'overflow-scroll'
    }
    // Add any other styling variants you need (padding, margin, etc.)
  },
  defaultVariants: {
    display: 'block'
  }
});

export interface BoxProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof boxVariants> {
  /** Gap between children – uses the spacing map */
  gap?: SpacingKey;
  /** Padding – uses spacing map */
  p?: SpacingKey;
  /** Margin – uses spacing map */
  m?: SpacingKey;
  /** Padding horizontal */
  px?: SpacingKey;
  /** Padding vertical */
  py?: SpacingKey;
  /** Padding top */
  pt?: SpacingKey;
  /** Padding right */
  pr?: SpacingKey;
  /** Padding bottom */
  pb?: SpacingKey;
  /** Padding left */
  pl?: SpacingKey;
  /** Margin horizontal */
  mx?: SpacingKey;
  /** Margin vertical */
  my?: SpacingKey;
  /** Margin top */
  mt?: SpacingKey;
  /** Margin right */
  mr?: SpacingKey;
  /** Margin bottom */
  mb?: SpacingKey;
  /** Margin left */
  ml?: SpacingKey;
  /** Render as a different element using Slot */
  asChild?: boolean;
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      className,
      display,
      position,
      overflow,
      gap,
      p,
      m,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'div';

    // Build spacing classes manually because Tailwind doesn't support dynamic prefixes easily
    // Better: map each prop to explicit class
    const spacingClasses = [
      applySpacing(gap), // gap-{value}
      applySpacing(p, 'p'), // p-{value}
      applySpacing(m, 'm'), // m-{value}
      applySpacing(px, 'px'), // px-{value}
      applySpacing(py, 'py'), // py-{value}
      applySpacing(pt, 'pt'), // pt-{value}
      applySpacing(pr, 'pr'), // pr-{value}
      applySpacing(pb, 'pb'), // pb-{value}
      applySpacing(pl, 'pl'), // pl-{value}
      applySpacing(mx, 'mx'), // mx-{value}
      applySpacing(my, 'my'), // my-{value}
      applySpacing(mt, 'mt'), // mt-{value}
      applySpacing(mr, 'mr'), // mr-{value}
      applySpacing(mb, 'mb'), // mb-{value}
      applySpacing(ml, 'ml') // ml-{value}
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Comp
        className={cn(boxVariants({ display, position, overflow }), spacingClasses, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Box.displayName = 'Box';

export { Box, boxVariants };
