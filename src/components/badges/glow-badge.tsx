import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import * as React from 'react';

import { cn } from '@/lib/utils';

const glowBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium transition-all',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        primary: 'bg-primary/10 text-primary',
        destructive: 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400',
        success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
        warning: 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

type GlowBadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof glowBadgeVariants> & {
    withPulse?: boolean;
  };

export function GlowBadge({
  className,
  variant,
  size,
  withPulse = false,
  children,
  ...props
}: GlowBadgeProps) {
  return (
    <motion.span
      className={cn(glowBadgeVariants({ variant, size }), className)}
      animate={
        withPulse
          ? {
              opacity: [0.8, 1, 0.8],
              scale: [0.98, 1.02, 0.98]
            }
          : {}
      }
      transition={
        withPulse
          ? {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          : {}
      }
      {...props}
    >
      {withPulse && (
        <span className='relative flex h-1.5 w-1.5'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75' />
          <span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-current' />
        </span>
      )}
      {children}
    </motion.span>
  );
}
