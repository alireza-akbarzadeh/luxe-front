'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
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
import type { GetOrdersId200 } from '@/services/-orders-{id}-get.schemas';

export interface OrderStripeConfirmState {
  isStripeReturn: boolean;
  isConfirming: boolean;
  confirmFailed: boolean;
  /** True once the confirm attempt finished (success or failure). */
  confirmSettled: boolean;
  /** Order payload from confirm-stripe — avoids a second fetch on success. */
  confirmedOrder: GetOrdersId200['data'];
}

/** Confirms Stripe payment once when returning from Checkout with payment=success. */
export function useOrderStripeConfirm(orderId: string): OrderStripeConfirmState {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { clearCart } = useCartController();
  const t = useTranslations('checkout.stripe');
  const handledSessionRef = useRef<string | null>(null);

  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmFailed, setConfirmFailed] = useState(false);
  const [confirmSettled, setConfirmSettled] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<GetOrdersId200['data']>();

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
    setConfirmSettled(false);

    const confirm = async () => {
      try {
        const result = await postCheckoutConfirmStripe({ session_id: sessionIdFromUrl });
        const confirmedOrderId = result.data?.id ?? Number(orderId);

        queryClient.setQueryData(getGetOrdersIdQueryKey(confirmedOrderId), result);
        setConfirmedOrder(result.data);

        clearStripeCheckoutSession(orderId);
        toast.success(result.message ?? t('paymentConfirmed'));

        router.replace(`/order-confirmed/${confirmedOrderId}?confirmed=1`, { scroll: false });

        void clearCart().catch(() => undefined);
      } catch (error: unknown) {
        setConfirmFailed(true);
        const message =
          error instanceof AxiosError
            ? extractErrorMessage(error as AxiosError<ApiErrorResponse>)
            : t('paymentConfirmError');
        toast.error(message || t('paymentConfirmError'));
      } finally {
        setIsConfirming(false);
        setConfirmSettled(true);
      }
    };

    void confirm();
  }, [clearCart, isStripeReturn, orderId, queryClient, router, sessionIdFromUrl, t]);

  return {
    isStripeReturn,
    isConfirming,
    confirmFailed,
    confirmSettled,
    confirmedOrder
  };
}
