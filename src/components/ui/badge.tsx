import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Slot } from './slot';

const badgeVariants = cva(
  'inline-flex flex-center rounded-md border font-medium w-fit whitespace-nowrap shrink-0 transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/85 dark:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/75 dark:bg-secondary dark:hover:bg-secondary/65',
        destructive:
          'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/15 dark:text-destructive dark:hover:bg-destructive/25',
        outline:
          'border-border bg-background text-foreground hover:bg-muted hover:text-foreground dark:bg-card/60 dark:hover:bg-muted/50',
        accent:
          'border-transparent bg-accent text-accent-foreground hover:bg-accent/90 dark:hover:bg-accent/85',
        muted:
          'border-transparent bg-muted text-muted-foreground hover:bg-muted/80 dark:hover:bg-muted/60',
        ghost:
          'border-transparent bg-transparent text-foreground hover:bg-muted dark:hover:bg-muted/50',
        inverse:
          'border-transparent bg-foreground text-background hover:bg-foreground/90 dark:hover:bg-foreground/85',
        accentOutline:
          'border-accent/50 bg-background/90 text-accent backdrop-blur-sm hover:bg-accent/10 dark:border-accent/40 dark:bg-card/70 dark:hover:bg-accent/15'
      },
      size: {
        default: 'gap-1 px-2.5 py-0.5 text-xs [&>svg]:size-3',
        sm: 'gap-0.5 rounded px-1.5 py-px text-[10px] leading-tight [&>svg]:size-2.5',
        lg: 'gap-1.5 rounded-md px-3 py-1 text-sm [&>svg]:size-3.5'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot='badge'
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
