'use client';

import { useSearchParams } from 'next/navigation';

import { useGetOrdersId } from '@/services/-orders-{id}-get';

import { useOrderStripeConfirm } from './use-order-stripe-confirm';

/** Loads order-confirmed page data without redundant Stripe-return fetches. */
export function useOrderConfirmedPage(orderId: string) {
  const id = Number(orderId);
  const validId = Number.isFinite(id) && id > 0;
  const searchParams = useSearchParams();
  const isFreshCheckout = searchParams.get('confirmed') === '1';

  const stripe = useOrderStripeConfirm(orderId);

  const shouldFetchOrder =
    validId && !stripe.confirmedOrder && (!stripe.isStripeReturn || stripe.confirmSettled);

  const orderQuery = useGetOrdersId(id, {
    query: {
      enabled: shouldFetchOrder,
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      retryDelay: 400,
      refetchOnWindowFocus: false
    }
  });

  const order = stripe.confirmedOrder ?? orderQuery.data?.data;

  const isResolving =
    validId && (stripe.isConfirming || (shouldFetchOrder && orderQuery.isLoading && !order));

  return {
    validId,
    isFreshCheckout,
    order,
    isResolving,
    confirmingPayment: stripe.isConfirming,
    confirmFailed: stripe.confirmFailed,
    isQueryError: orderQuery.isError
  };
}
