import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Spinner } from './spinner';

const buttonVariants = cva(
  [
    'group/button relative inline-flex shrink-0 select-none items-center justify-center gap-2',
    'whitespace-nowrap border border-transparent bg-clip-padding text-sm font-medium tracking-wide',
    'outline-none transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out',
    'focus-visible:ring-[3px] focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    'rounded-full'
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground',
          'shadow-[0_1px_2px_rgba(10,10,11,0.06),0_6px_18px_rgba(10,10,11,0.08)]',
          'hover:bg-primary/92 hover:shadow-[0_2px_4px_rgba(10,10,11,0.08),0_10px_24px_rgba(10,10,11,0.1)]',
          'dark:shadow-[0_1px_2px_rgba(0,0,0,0.35),0_8px_20px_rgba(0,0,0,0.28)]',
          'dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),0_12px_28px_rgba(0,0,0,0.32)]'
        ].join(' '),
        outline: [
          'border-border/80 bg-background/90 text-foreground shadow-sm backdrop-blur-sm',
          'hover:border-accent/45 hover:bg-muted/80 hover:text-foreground',
          'aria-expanded:border-accent/45 aria-expanded:bg-muted/80 aria-expanded:text-foreground'
        ].join(' '),
        secondary: [
          'border-border/70 bg-secondary text-secondary-foreground shadow-sm',
          'hover:border-border hover:bg-muted'
        ].join(' '),
        ghost: [
          'text-foreground/85 hover:bg-muted/75 hover:text-foreground',
          'dark:hover:bg-muted/50'
        ].join(' '),
        destructive: [
          'border-destructive/15 bg-destructive/10 text-destructive',
          'hover:border-destructive/25 hover:bg-destructive/15'
        ].join(' '),
        link: 'h-auto rounded-none px-0 text-foreground underline-offset-4 hover:text-accent hover:underline active:scale-100',
        success: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-600/90',
        warning: 'bg-amber-500 text-white shadow-sm hover:bg-amber-500/90',
        info: 'bg-sky-600 text-white shadow-sm hover:bg-sky-600/90',
        brand: [
          'border border-gold-strong/20 bg-gold text-gold-foreground',
          'shadow-[0_2px_8px_color-mix(in_oklab,var(--gold)_32%,transparent)]',
          'hover:border-gold-strong/30 hover:bg-gold-strong hover:text-gold-foreground',
          'hover:shadow-[0_4px_16px_color-mix(in_oklab,var(--gold)_38%,transparent)]'
        ].join(' '),
        'outline-success':
          'border-emerald-600/30 bg-transparent text-emerald-700 hover:bg-emerald-600/10 dark:text-emerald-400',
        'outline-warning':
          'border-amber-500/30 bg-transparent text-amber-700 hover:bg-amber-500/10 dark:text-amber-400',
        'outline-info':
          'border-sky-600/30 bg-transparent text-sky-700 hover:bg-sky-600/10 dark:text-sky-400',
        'outline-brand':
          'border-gold/40 bg-transparent text-gold-strong hover:border-gold/60 hover:bg-gold/10 dark:text-gold',
        ice: 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md hover:from-sky-500 hover:to-blue-600 hover:shadow-lg dark:from-sky-600 dark:to-blue-700'
      },
      size: {
        default: 'h-10 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        xs: "h-7 gap-1.5 px-3 text-xs has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 gap-1.5 px-4 text-[0.8125rem] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-11 gap-2 px-6 text-[0.9375rem] has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5',
        icon: 'size-10',
        'icon-xs': "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-sm': 'size-9',
        'icon-lg': 'size-11'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';
  const isDisabled = disabled || loading;

  if (asChild) {
    return (
      <Comp
        data-slot='button'
        data-variant={variant}
        data-size={size}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      data-slot='button'
      data-variant={variant}
      data-size={size}
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size, className }), loading && 'cursor-not-allowed')}
      {...props}
    >
      {loading && <Spinner className='size-4 shrink-0 opacity-80' />}
      {children}
    </Comp>
  );
}

export { buttonVariants };
