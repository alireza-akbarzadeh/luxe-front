'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { postCheckoutConfirmStripe } from '@/domains/checkout/lib/confirm-checkout-stripe';
import {
  clearStripeCheckoutSession,
  persistStripeCheckoutSession,
  readStripeCheckoutSession
} from '@/domains/checkout/lib/stripe-checkout-session-storage';
import { useCartController } from '@/hooks/useCartController';
import { extractErrorMessage } from '@/lib/api/api-utils';
import type { ApiErrorResponse } from '@/lib/api/type';
import { getGetOrdersIdQueryKey } from '@/services/-orders-{id}-get';

function getStripeSessionIdFromUrl(searchParams: URLSearchParams) {
  return searchParams.get('session_id')?.trim() ?? '';
}

function resolveStripeSessionForConfirm(orderId: string, searchParams: URLSearchParams) {
  const urlSessionId = getStripeSessionIdFromUrl(searchParams);
  if (urlSessionId) {
    return urlSessionId;
  }

  const payment = searchParams.get('payment');
  const confirmed = searchParams.get('confirmed');
  if (payment === 'success' || confirmed === '1') {
    return readStripeCheckoutSession(orderId);
  }

  return null;
}

function shouldConfirmStripePayment(searchParams: URLSearchParams, sessionId: string | null) {
  if (!sessionId) return false;

  const payment = searchParams.get('payment');
  if (payment === 'success') return true;

  return searchParams.get('confirmed') === '1';
}

interface OrderStripeReturnHandlerProps {
  orderId: string;
}

/** Confirms Stripe order payment on return from Checkout (and retries after URL cleanup). */
export function OrderStripeReturnHandler({ orderId }: OrderStripeReturnHandlerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearCart } = useCartController();
  const t = useTranslations('checkout.stripe');
  const handledSessionRef = useRef<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const sessionId = resolveStripeSessionForConfirm(orderId, searchParams);
    if (!shouldConfirmStripePayment(searchParams, sessionId)) {
      return;
    }

    if (handledSessionRef.current === sessionId) {
      return;
    }

    const urlSessionId = getStripeSessionIdFromUrl(searchParams);
    if (urlSessionId) {
      persistStripeCheckoutSession(orderId, urlSessionId);
    }

    handledSessionRef.current = sessionId;
    setIsConfirming(true);

    const confirm = async () => {
      try {
        const result = await postCheckoutConfirmStripe({ session_id: sessionId! });
        const confirmedOrderId = result.data?.id ?? Number(orderId);

        queryClient.setQueryData(getGetOrdersIdQueryKey(confirmedOrderId), result);

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getGetOrdersIdQueryKey(confirmedOrderId)
          }),
          clearCart().catch(() => undefined)
        ]);

        clearStripeCheckoutSession(orderId);

        toast.success(result.message ?? t('paymentConfirmed'));

        if (searchParams.get('confirmed') !== '1') {
          router.replace(`/order-confirmed/${confirmedOrderId}?confirmed=1`);
        }
      } catch (error: unknown) {
        const message =
          error instanceof AxiosError
            ? extractErrorMessage(error as AxiosError<ApiErrorResponse>)
            : t('paymentConfirmError');
        toast.error(message || t('paymentConfirmError'));

        if (searchParams.get('payment') === 'success') {
          router.replace(`/order-confirmed/${orderId}`);
        }
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
