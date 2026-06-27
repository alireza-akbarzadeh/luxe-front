'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { postCheckoutConfirmStripe } from '@/domains/checkout/lib/confirm-checkout-stripe';
import {
  clearStripeCheckoutSession,
  persistStripeCheckoutSession
} from '@/domains/checkout/lib/stripe-checkout-session-storage';
import { useCartController } from '@/hooks/useCartController';
import { extractErrorMessage } from '@/lib/api/api-utils';
import type { ApiErrorResponse } from '@/lib/api/type';
import { getGetOrdersIdQueryKey } from '@/services/-orders-{id}-get';

export interface OrderStripeConfirmState {
  isStripeReturn: boolean;
  isConfirming: boolean;
  confirmFailed: boolean;
}

/** Confirms Stripe payment once when returning from Checkout with payment=success. */
export function useOrderStripeConfirm(orderId: string): OrderStripeConfirmState {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { clearCart } = useCartController();
  const t = useTranslations('checkout.stripe');
  const handledSessionRef = useRef<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmFailed, setConfirmFailed] = useState(false);

  const payment = searchParams.get('payment');
  const sessionIdFromUrl = searchParams.get('session_id')?.trim() ?? '';
  const isStripeReturn = payment === 'success' && sessionIdFromUrl.length > 0;

  useEffect(() => {
    if (!isStripeReturn) return;
    if (handledSessionRef.current === sessionIdFromUrl) return;

    persistStripeCheckoutSession(orderId, sessionIdFromUrl);
    handledSessionRef.current = sessionIdFromUrl;
    setIsConfirming(true);
    setConfirmFailed(false);

    const confirm = async () => {
      try {
        const result = await postCheckoutConfirmStripe({ session_id: sessionIdFromUrl });
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

        const url = new URL(window.location.href);
        url.searchParams.delete('payment');
        url.searchParams.delete('session_id');
        url.searchParams.set('confirmed', '1');
        window.history.replaceState(null, '', url.toString());
      } catch (error: unknown) {
        setConfirmFailed(true);
        const message =
          error instanceof AxiosError
            ? extractErrorMessage(error as AxiosError<ApiErrorResponse>)
            : t('paymentConfirmError');
        toast.error(message || t('paymentConfirmError'));
      } finally {
        setIsConfirming(false);
      }
    };

    void confirm();
  }, [clearCart, isStripeReturn, orderId, queryClient, sessionIdFromUrl, t]);

  return { isStripeReturn, isConfirming, confirmFailed };
}
