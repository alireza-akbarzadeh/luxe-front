import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { type SpacingKey, spacingMap } from '@/components/theme/spacing';
import { Slot } from '@/components/ui/slot';
import { cn } from '@/lib/utils';

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
      none: 'grid-cols-none'
    },
    rows: {
      1: 'grid-rows-1',
      2: 'grid-rows-2',
      3: 'grid-rows-3',
      4: 'grid-rows-4',
      5: 'grid-rows-5',
      6: 'grid-rows-6',
      none: 'grid-rows-none'
    },
    flow: {
      row: 'grid-flow-row',
      column: 'grid-flow-col',
      dense: 'grid-flow-dense',
      'row-dense': 'grid-flow-row-dense',
      'col-dense': 'grid-flow-col-dense'
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
    inline: {
      true: 'inline-grid'
    }
  },
  defaultVariants: {
    align: 'stretch'
  }
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof gridVariants> {
  gap?: SpacingKey;
  gapX?: SpacingKey;
  gapY?: SpacingKey;
  asChild?: boolean;
}

const gapXMap = Object.fromEntries(
  Object.entries(spacingMap).map(([k, v]) => [k, v.replace('gap-', 'gap-x-')])
) as Record<SpacingKey, string>;

const gapYMap = Object.fromEntries(
  Object.entries(spacingMap).map(([k, v]) => [k, v.replace('gap-', 'gap-y-')])
) as Record<SpacingKey, string>;

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    { className, cols, rows, flow, align, justify, inline, gap, gapX, gapY, asChild, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        className={cn(
          gridVariants({ cols, rows, flow, align, justify, inline }),
          gap !== undefined ? spacingMap[gap] : '',
          gapX !== undefined ? gapXMap[gapX] : '',
          gapY !== undefined ? gapYMap[gapY] : '',
          className
        )}
        {...props}
      />
    );
  }
);

Grid.displayName = 'Grid';

export { Grid, gridVariants };
