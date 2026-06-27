'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { postCheckoutConfirmStripe } from '@/domains/checkout/lib/confirm-checkout-stripe';
import { useCartController } from '@/hooks/useCartController';
import { extractErrorMessage } from '@/lib/api/api-utils';
import type { ApiErrorResponse } from '@/lib/api/type';
import { getGetOrdersIdQueryKey } from '@/services/-orders-{id}-get';

function getStripeSessionId(searchParams: URLSearchParams) {
  return searchParams.get('session_id')?.trim() ?? '';
}

interface OrderStripeReturnHandlerProps {
  orderId: string;
}

/** Confirms Stripe order payment on return from Checkout. */
export function OrderStripeReturnHandler({ orderId }: OrderStripeReturnHandlerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearCart } = useCartController();
  const t = useTranslations('checkout.stripe');
  const handledSessionRef = useRef<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const status = searchParams.get('payment');
    const sessionId = getStripeSessionId(searchParams);

    if (status !== 'success' || !sessionId) {
      return;
    }

    if (handledSessionRef.current === sessionId) {
      return;
    }

    handledSessionRef.current = sessionId;
    setIsConfirming(true);

    const confirm = async () => {
      try {
        const result = await postCheckoutConfirmStripe({ session_id: sessionId });
        const confirmedOrderId = result.data?.id ?? Number(orderId);

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getGetOrdersIdQueryKey(confirmedOrderId)
          }),
          clearCart().catch(() => undefined)
        ]);

        toast.success(result.message ?? t('paymentConfirmed'));
        router.replace(`/order-confirmed/${confirmedOrderId}?confirmed=1`);
      } catch (error: unknown) {
        const message =
          error instanceof AxiosError
            ? extractErrorMessage(error as AxiosError<ApiErrorResponse>)
            : t('paymentConfirmError');
        toast.error(message || t('paymentConfirmError'));
        router.replace(`/order-confirmed/${orderId}`);
      } finally {
        setIsConfirming(false);
      }
    };

    void confirm();
  }, [clearCart, orderId, queryClient, router, searchParams, t]);

  if (!isConfirming) {
    return null;
  }

  return (
    <div
      className='border-accent/30 bg-accent/5 mb-6 flex items-center gap-3 rounded-2xl border p-4'
      role='status'
      aria-live='polite'
    >
      <IconLoader2 className='text-accent h-5 w-5 animate-spin' aria-hidden />
      <p className='text-sm font-medium'>{t('paymentConfirming')}</p>
    </div>
  );
}
