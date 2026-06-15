'use client';

import { IconMinus, IconPlus } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

interface ProductQuantityProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  stock: number;
}

export default function ProductQuantity(props: ProductQuantityProps) {
  const { value, onIncrement, onDecrement, stock } = props;
  const isOutOfStock = stock <= 0;
  const isMaxReached = value >= stock;

  if (isOutOfStock) {
    return (
      <div className='rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive'>
        This item is currently unavailable.
      </div>
    );
  }

  return (
    <div className='flex flex-wrap items-center justify-between gap-4'>
      <div>
        <p className='mb-2.5 text-sm font-medium'>Quantity</p>
        <div className='border-border/80 bg-background inline-flex items-center rounded-full border shadow-sm'>
          <button
            type='button'
            onClick={onDecrement}
            disabled={value <= 0}
            className='text-muted-foreground hover:text-foreground rounded-l-full px-4 py-3 transition disabled:opacity-40'
            aria-label='Decrease quantity'
          >
            <IconMinus className='h-4 w-4' />
          </button>
          <span className='min-w-10 text-center text-sm font-semibold tabular-nums'>{value}</span>
          <button
            type='button'
            onClick={onIncrement}
            disabled={isMaxReached}
            className={cn(
              'rounded-r-full px-4 py-3 transition disabled:opacity-40',
              'text-muted-foreground hover:text-foreground'
            )}
            aria-label='Increase quantity'
          >
            <IconPlus className='h-4 w-4' />
          </button>
        </div>
      </div>

      <p className='text-muted-foreground text-xs sm:text-sm'>
        {stock <= 5 ? `Only ${stock} left in stock` : `${stock} available`}
      </p>
    </div>
  );
}
