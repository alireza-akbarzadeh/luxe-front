import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { applySpacing } from '@/components/theme/helper';
import { type SpacingKey } from '@/components/theme/spacing';
import { Slot } from '@/components/ui/slot';
import { cn } from '@/lib/utils';

const flexVariants = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse'
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline'
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly'
    },
    wrap: {
      wrap: 'flex-wrap',
      nowrap: 'flex-nowrap',
      'wrap-reverse': 'flex-wrap-reverse'
    },
    inline: {
      true: 'inline-flex'
    },
    /** Shorthand for align + justify center */
    center: {
      true: 'items-center justify-center'
    },
    fullWidth: {
      true: 'w-full'
    },
    fullHeight: {
      true: 'h-full'
    },
    grow: {
      true: 'flex-1'
    },
    shrink: {
      true: 'shrink-0'
    }
  },
  defaultVariants: {
    direction: 'column',
    align: 'stretch',
    justify: 'start',
    wrap: 'nowrap'
  }
});

export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof flexVariants> {
  /** Gap between children (alias: `gap`) */
  spacing?: SpacingKey;
  /** Alias for `spacing` — matches Grid API */
  gap?: SpacingKey;
  gapX?: SpacingKey;
  gapY?: SpacingKey;
  p?: SpacingKey;
  px?: SpacingKey;
  py?: SpacingKey;
  asChild?: boolean;
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      direction,
      align,
      justify,
      wrap,
      inline,
      center,
      fullWidth,
      fullHeight,
      grow,
      shrink,
      spacing,
      gap,
      gapX,
      gapY,
      p,
      px,
      py,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'div';
    const gapValue = gap ?? spacing;

    return (
      <Comp
        ref={ref}
        data-slot='flex'
        className={cn(
          flexVariants({
            direction,
            align: center ? undefined : align,
            justify: center ? undefined : justify,
            wrap,
            inline,
            center,
            fullWidth,
            fullHeight,
            grow,
            shrink
          }),
          applySpacing(gapValue),
          applySpacing(gapX, 'gap-x'),
          applySpacing(gapY, 'gap-y'),
          applySpacing(p, 'p'),
          applySpacing(px, 'px'),
          applySpacing(py, 'py'),
          className
        )}
        {...props}
      />
    );
  }
);

Flex.displayName = 'Flex';

export { Flex, flexVariants };
