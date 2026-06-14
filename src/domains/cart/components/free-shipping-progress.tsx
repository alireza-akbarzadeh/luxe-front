import { IconTruck } from '@tabler/icons-react';

import { formatPrice } from '@/domains/home/lib/home-utils';
import { cn } from '@/lib/utils';

import { FREE_SHIPPING_THRESHOLD, getFreeShippingRemaining } from '../lib/cart-utils';

interface FreeShippingProgressProps {
  subtotal: number;
  className?: string;
}

export function FreeShippingProgress({ subtotal, className }: FreeShippingProgressProps) {
  const remaining = getFreeShippingRemaining(subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
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
          className={cn('h-4 w-4 shrink-0', qualified ? 'text-accent' : 'text-muted-foreground')}
        />
        {qualified ? (
          <span className='text-accent font-medium'>You qualify for free shipping</span>
        ) : (
          <span>
            Add{' '}
            <span className='text-accent font-semibold tabular-nums'>{formatPrice(remaining)}</span>{' '}
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
