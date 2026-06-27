'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

/** Handles return from Stripe when the customer cancels payment. */
export function CheckoutPaymentCancelledHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('checkout.stripe');
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;

    const payment = searchParams.get('payment');
    if (payment !== 'cancelled') return;

    handledRef.current = true;
    const orderId = searchParams.get('order_id')?.trim();

    toast.message(t('paymentCancelled'));

    if (orderId) {
      router.replace(`/order-tracking/${orderId}`);
      return;
    }

    router.replace('/checkout');
  }, [router, searchParams, t]);

  return null;
}
