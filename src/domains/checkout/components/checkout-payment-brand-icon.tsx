'use client';

import {
  IconBrandApple,
  IconBrandGoogle,
  IconBrandPaypal,
  IconCreditCard,
  IconWallet
} from '@tabler/icons-react';

import { AppImage } from '@/components/ui/app-image';
import { cn } from '@/lib/utils';

import type { CheckoutPaymentMethodOption } from '../lib/checkout-payment-methods';

interface CheckoutPaymentBrandIconProps {
  method: CheckoutPaymentMethodOption;
  className?: string;
}

/** Brand mark for payment method chips — icon URL or built-in glyph. */
export function CheckoutPaymentBrandIcon({ method, className }: CheckoutPaymentBrandIconProps) {
  if (method.iconUrl) {
    return (
      <span className={cn('relative size-6 overflow-hidden rounded-md', className)}>
        <AppImage src={method.iconUrl} alt='' fill sizes='24px' className='object-contain' />
      </span>
    );
  }

  const iconClass = cn('size-5', className);

  switch (method.brand) {
    case 'stripe':
      return (
        <span
          className={cn('text-[11px] font-black tracking-tight text-[#635BFF]', className)}
          aria-hidden
        >
          S
        </span>
      );
    case 'paypal':
      return <IconBrandPaypal className={cn(iconClass, 'text-[#003087]')} aria-hidden />;
    case 'apple':
      return <IconBrandApple className={iconClass} aria-hidden />;
    case 'google':
      return <IconBrandGoogle className={iconClass} aria-hidden />;
    case 'wallet':
      return <IconWallet className={iconClass} aria-hidden />;
    case 'card':
      return <IconCreditCard className={iconClass} aria-hidden />;
    default:
      return <IconCreditCard className={iconClass} aria-hidden />;
  }
}
