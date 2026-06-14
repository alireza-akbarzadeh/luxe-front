import { cn } from '@/lib/utils';

interface OrderNumberProps {
  value: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm sm:text-base',
  lg: 'text-base sm:text-lg'
} as const;

/**
 * Monospace order IDs — avoids display serif fonts on long numeric strings.
 */
export function OrderNumber({ value, className, size = 'md' }: OrderNumberProps) {
  return (
    <span
      className={cn(
        'font-mono font-semibold break-all text-foreground tabular-nums tracking-normal',
        sizeClasses[size],
        className
      )}
      title={value}
    >
      {value}
    </span>
  );
}

export const orderNumberClassName =
  'font-mono font-semibold break-all text-foreground tabular-nums tracking-normal';
