'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface OrderConfirmedResolvingProps {
  confirmingPayment: boolean;
}

/** Full-page hold while Stripe confirm or order fetch completes after payment return. */
export function OrderConfirmedResolving({ confirmingPayment }: OrderConfirmedResolvingProps) {
  const t = useTranslations('checkout.stripe');

  return (
    <div className='flex min-h-[60vh] items-center justify-center px-4 pt-24 pb-16'>
      <div className='text-center' role='status' aria-live='polite'>
        <IconLoader2 className='text-accent mx-auto mb-4 h-10 w-10 animate-spin' />
        <h2 className='text-lg font-semibold'>
          {confirmingPayment ? t('paymentConfirming') : 'Loading your order…'}
        </h2>
        <p className='text-muted-foreground mt-1 text-sm'>
          {confirmingPayment
            ? 'Please wait while we verify your payment.'
            : 'This usually takes a moment.'}
        </p>
      </div>
    </div>
  );
}
