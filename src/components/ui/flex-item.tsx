import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { Slot } from '@/components/ui/slot';
import { cn } from '@/lib/utils';

const flexItemVariants = cva('', {
  variants: {
    grow: {
      0: 'grow-0',
      1: 'grow'
    },
    shrink: {
      0: 'shrink-0',
      1: 'shrink'
    },
    basis: {
      auto: 'basis-auto',
      full: 'basis-full',
      '1/2': 'basis-1/2',
      '1/3': 'basis-1/3',
      '2/3': 'basis-2/3',
      '1/4': 'basis-1/4',
      '3/4': 'basis-3/4'
    },
    alignSelf: {
      auto: 'self-auto',
      start: 'self-start',
      center: 'self-center',
      end: 'self-end',
      stretch: 'self-stretch',
      baseline: 'self-baseline'
    },
    order: {
      first: 'order-first',
      last: 'order-last',
      none: 'order-none'
    }
  }
});

export interface FlexItemProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof flexItemVariants> {
  asChild?: boolean;
}

const FlexItem = React.forwardRef<HTMLDivElement, FlexItemProps>(
  ({ className, grow, shrink, basis, alignSelf, order, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        className={cn(flexItemVariants({ grow, shrink, basis, alignSelf, order }), className)}
        {...props}
      />
    );
  }
);

FlexItem.displayName = 'FlexItem';

export { FlexItem, flexItemVariants };
