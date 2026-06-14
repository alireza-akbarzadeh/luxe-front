'use client';

import { IconArrowRight } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { cn } from '@/lib/utils';

interface CartMobileCheckoutBarProps {
  total: number;
  itemCount: number;
  onCheckout: () => void;
}

export function CartMobileCheckoutBar({
  total,
  itemCount,
  onCheckout
}: CartMobileCheckoutBarProps) {
  return (
    <div className='bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t p-4 backdrop-blur-md lg:hidden'>
      <div className='mx-auto flex max-w-7xl items-center gap-3'>
        <div className='min-w-0 flex-1'>
          <p className='text-muted-foreground text-xs'>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
          <p className={cn('text-lg font-semibold', cartMoneyClassName)}>
            {formatCartMoney(total)}
          </p>
        </div>
        <Button
          type='button'
          className='h-11 shrink-0 rounded-full px-6'
          size='lg'
          disabled={itemCount === 0}
          onClick={onCheckout}
        >
          Checkout
          <IconArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
