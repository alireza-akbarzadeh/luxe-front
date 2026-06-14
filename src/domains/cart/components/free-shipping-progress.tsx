import { IconTruck } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

import { useCartCommerceSettings } from '../hooks/use-cart-commerce-settings';
import { formatCartMoney, getFreeShippingRemaining } from '../lib/cart-utils';

interface FreeShippingProgressProps {
  subtotal: number;
  className?: string;
}

export function FreeShippingProgress({ subtotal, className }: FreeShippingProgressProps) {
  const { settings } = useCartCommerceSettings();
  const threshold = settings.freeShippingThreshold;
  const remaining = getFreeShippingRemaining(subtotal, threshold);
  const progress = threshold > 0 ? Math.min(100, (subtotal / threshold) * 100) : 100;
  const qualified = remaining <= 0;

  return (
    <div
      className={cn(
        'rounded-xl border px-4 py-3',
        qualified ? 'border-accent/30 bg-accent/5' : 'border-border/60 bg-muted/30',
        className
      )}
    >
      <div className='mb-2 flex items-center gap-2 text-sm'>
        <IconTruck
          className={cn('size-4 shrink-0', qualified ? 'text-accent' : 'text-muted-foreground')}
        />
        {qualified ? (
          <span className='text-accent font-medium'>You qualify for free shipping</span>
        ) : (
          <span>
            Add{' '}
            <span
              className={cn('text-accent font-semibold', 'font-sans tracking-tight tabular-nums')}
            >
              {formatCartMoney(remaining)}
            </span>{' '}
            more for free shipping
          </span>
        )}
      </div>
      <div className='bg-muted h-1.5 overflow-hidden rounded-full'>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            qualified ? 'bg-accent' : 'bg-primary'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
