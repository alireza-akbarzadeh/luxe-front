import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { type SpacingKey, spacingMap } from '@/components/theme/spacing';
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
  spacing?: SpacingKey;
  asChild?: boolean;
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, align, justify, wrap, inline, spacing, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        className={cn(
          flexVariants({ direction, align, justify, wrap, inline }),
          spacing !== undefined ? spacingMap[spacing] : '',
          className
        )}
        {...props}
      />
    );
  }
);

Flex.displayName = 'Flex';

export { Flex, flexVariants };
