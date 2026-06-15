import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { applySpacing } from '@/components/theme/helper';
import { type SpacingKey } from '@/components/theme/spacing';
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
    alignContent: {
      start: 'content-start',
      center: 'content-center',
      end: 'content-end',
      between: 'content-between',
      around: 'content-around',
      evenly: 'content-evenly',
      stretch: 'content-stretch'
    },
    placeItems: {
      start: 'place-items-start',
      center: 'place-items-center',
      end: 'place-items-end',
      stretch: 'place-items-stretch'
    },
    inline: {
      true: 'inline-grid'
    },
    fullWidth: {
      true: 'w-full'
    },
    fullHeight: {
      true: 'h-full'
    },
    /** Responsive layout presets for common page patterns */
    template: {
      /** 1 col → 2 cols at sm */
      '1-2': 'grid-cols-1 sm:grid-cols-2',
      /** 1 col → 3 cols at lg */
      '1-3': 'grid-cols-1 lg:grid-cols-3',
      /** 2 cols → 4 cols at lg */
      '2-4': 'grid-cols-2 lg:grid-cols-4',
      /** Standard form: 1 col → 2 cols at md */
      form: 'grid-cols-1 md:grid-cols-2',
      /** Sidebar + main content */
      sidebar: 'grid-cols-1 lg:grid-cols-[minmax(14rem,18rem)_1fr]',
      /** Dashboard stat cards */
      stats: 'grid-cols-2 lg:grid-cols-4'
    },
    /** Auto-fit columns with minimum child width */
    autoFit: {
      sm: 'grid-cols-[repeat(auto-fit,minmax(8rem,1fr))]',
      md: 'grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]',
      lg: 'grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]',
      xl: 'grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]'
    },
    /** Auto-fill (fixed column count, may leave empty tracks) */
    autoFill: {
      sm: 'grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]',
      md: 'grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]',
      lg: 'grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]',
      xl: 'grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]'
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
  p?: SpacingKey;
  px?: SpacingKey;
  py?: SpacingKey;
  asChild?: boolean;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      cols,
      rows,
      flow,
      align,
      justify,
      alignContent,
      placeItems,
      inline,
      fullWidth,
      fullHeight,
      template,
      autoFit,
      autoFill,
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
    const usesPreset = Boolean(template || autoFit || autoFill);

    return (
      <Comp
        ref={ref}
        data-slot='grid'
        className={cn(
          gridVariants({
            cols: usesPreset ? undefined : cols,
            rows,
            flow,
            align,
            justify,
            alignContent,
            placeItems,
            inline,
            fullWidth,
            fullHeight,
            template,
            autoFit,
            autoFill
          }),
          applySpacing(gap),
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

Grid.displayName = 'Grid';

export { Grid, gridVariants };
