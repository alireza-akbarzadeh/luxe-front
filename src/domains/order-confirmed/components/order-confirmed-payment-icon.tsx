'use client';

import { IconCreditCard, IconWallet } from '@tabler/icons-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

import type { OrderPaymentBrand } from '../lib/order-confirmed-utils';

const PAYMENT_BRAND_ASSET: Partial<Record<OrderPaymentBrand, string>> = {
  stripe: '/assets/stripe.svg',
  paypal: '/assets/paypal.svg',
  apple: '/assets/apple.svg',
  google: '/assets/google-pay.svg'
};

interface OrderConfirmedPaymentIconProps {
  brand: OrderPaymentBrand;
  className?: string;
}

/** Brand mark for payment method on the order confirmed card. */
export function OrderConfirmedPaymentIcon({ brand, className }: OrderConfirmedPaymentIconProps) {
  const src = PAYMENT_BRAND_ASSET[brand];

  if (src) {
    return (
      <span className={cn('relative flex size-6 shrink-0 items-center justify-center', className)}>
        <Image
          src={src}
          alt=''
          width={24}
          height={24}
          unoptimized
          className='size-6 object-contain'
          aria-hidden
        />
      </span>
    );
  }

  const iconClass = cn('size-5 text-muted-foreground', className);

  if (brand === 'wallet') {
    return <IconWallet className={iconClass} aria-hidden />;
  }

  return <IconCreditCard className={iconClass} aria-hidden />;
}
