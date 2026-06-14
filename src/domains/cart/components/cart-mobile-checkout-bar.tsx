'use client';

import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/domains/home/lib/home-utils';

interface CartMobileCheckoutBarProps {
  total: number;
  itemCount: number;
  checkoutDisabled?: boolean;
  disabledReason?: string;
}

export function CartMobileCheckoutBar({
  total,
  itemCount,
  checkoutDisabled,
  disabledReason
}: CartMobileCheckoutBarProps) {
  return (
    <div className='bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t p-4 backdrop-blur-md lg:hidden'>
      <div className='mx-auto flex max-w-7xl items-center gap-3'>
        <div className='min-w-0 flex-1'>
          <p className='text-muted-foreground text-xs'>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
          <p className='text-lg font-semibold tabular-nums'>{formatPrice(total)}</p>
          {checkoutDisabled && disabledReason && (
            <p className='text-destructive line-clamp-1 text-[11px]'>{disabledReason}</p>
          )}
        </div>
        <Button
          asChild={!checkoutDisabled}
          className='h-11 shrink-0 rounded-full px-6'
          size='lg'
          disabled={checkoutDisabled}
        >
          {checkoutDisabled ? (
            <span>Checkout</span>
          ) : (
            <Link href='/checkout'>
              Checkout
              <IconArrowRight className='ml-2 h-4 w-4' />
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
}
