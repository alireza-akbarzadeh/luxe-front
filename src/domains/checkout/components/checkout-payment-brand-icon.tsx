'use client';

import { IconCreditCard, IconWallet } from '@tabler/icons-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

import type { CheckoutPaymentMethodOption } from '../lib/checkout-payment-methods';

/** Local brand marks under `public/assets/` — used when API has no `icon_url`. */
const PAYMENT_BRAND_ASSET: Partial<Record<CheckoutPaymentMethodOption['brand'], string>> = {
  stripe: '/assets/stripe.svg',
  paypal: '/assets/paypal.svg',
  apple: '/assets/apple.svg',
  google: '/assets/google-pay.svg'
};

interface CheckoutPaymentBrandIconProps {
  method: CheckoutPaymentMethodOption;
  className?: string;
}

/** Brand mark for payment method chips — asset SVG, API icon, or fallback glyph. */
export function CheckoutPaymentBrandIcon({ method, className }: CheckoutPaymentBrandIconProps) {
  const src = method.iconUrl?.trim() || PAYMENT_BRAND_ASSET[method.brand];

  if (src) {
    return (
      <span className={cn('relative flex size-7 shrink-0 items-center justify-center', className)}>
        <Image
          src={src}
          alt=''
          width={28}
          height={28}
          unoptimized
          className='size-7 object-contain'
          aria-hidden
        />
      </span>
    );
  }

  const iconClass = cn('size-5', className);

  if (method.brand === 'wallet') {
    return <IconWallet className={iconClass} aria-hidden />;
  }

  return <IconCreditCard className={iconClass} aria-hidden />;
}
