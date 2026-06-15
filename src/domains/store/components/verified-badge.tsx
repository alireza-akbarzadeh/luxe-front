import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

type VerifiedBadgeSize = 'xs' | 'sm' | 'md' | 'lg';

const sizeClasses: Record<VerifiedBadgeSize, { wrap: string; icon: string }> = {
  xs: { wrap: 'h-3.5 w-3.5', icon: 'h-2.5 w-2.5' },
  sm: { wrap: 'h-4 w-4', icon: 'h-3 w-3' },
  md: { wrap: 'h-5 w-5', icon: 'h-3.5 w-3.5' },
  lg: { wrap: 'h-6 w-6', icon: 'h-4 w-4' }
};

interface VerifiedBadgeProps {
  className?: string;
  size?: VerifiedBadgeSize;
  /** Show a compact "Verified" pill instead of icon-only */
  showLabel?: boolean;
}

/** Bluish verified mark — distinct from gold brand accents */
export function VerifiedBadge({ className, size = 'md', showLabel = false }: VerifiedBadgeProps) {
  const sizes = sizeClasses[size];

  if (showLabel) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide',
          'border-sky-400/40 bg-sky-500/12 text-sky-700 dark:border-sky-400/30 dark:bg-sky-500/20 dark:text-sky-300',
          className
        )}
      >
        <IconRosetteDiscountCheckFilled className='h-3.5 w-3.5 shrink-0 text-sky-500 dark:text-sky-400' />
        Verified
      </span>
    );
  }

  return (
    <span
      aria-label='Verified store'
      title='Verified store'
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        'bg-linear-to-br from-sky-400 to-blue-600 text-white shadow-sm ring-2 ring-white/80 dark:ring-white/15',
        sizes.wrap,
        className
      )}
    >
      <IconRosetteDiscountCheckFilled className={sizes.icon} />
    </span>
  );
}
