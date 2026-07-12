'use client';

import { useMemo } from 'react';

import { useGetPaymentProviders } from '@/services/-payment-providers-get';
import { useGetSettings } from '@/services/-settings-get';

import {
  type CheckoutPaymentMethodOption,
  mapCheckoutPaymentMethodToApi,
  resolveCheckoutPaymentMethods,
  resolveDefaultCheckoutPaymentMethod
} from '../lib/checkout-payment-methods';
import { useStripeCheckoutEnabled } from './useStripeCheckoutEnabled';

/** Loads payment catalog + settings default for the checkout picker. */
export function useCheckoutPaymentMethods() {
  const { isStripeCheckout, isLoading: isStripeLoading } = useStripeCheckoutEnabled();
  const providersQuery = useGetPaymentProviders({ is_active: true });
  const settingsQuery = useGetSettings({
    query: { staleTime: 1000 * 60 * 5 }
  });

  const methods: CheckoutPaymentMethodOption[] = useMemo(
    () =>
      resolveCheckoutPaymentMethods(providersQuery.data?.data, {
        stripeEnabled: isStripeCheckout
      }),
    [providersQuery.data?.data, isStripeCheckout]
  );

  const defaultMethodId = useMemo(
    () =>
      resolveDefaultCheckoutPaymentMethod(
        settingsQuery.data?.data,
        methods.map((method) => method.id),
        isStripeCheckout ? 'stripe' : 'credit_card'
      ),
    [settingsQuery.data?.data, methods, isStripeCheckout]
  );

  return {
    methods,
    defaultMethodId,
    isStripeCheckout,
    isLoading: isStripeLoading || providersQuery.isLoading || settingsQuery.isLoading,
    error: providersQuery.error,
    mapToApi: (method: string) => mapCheckoutPaymentMethodToApi(method, methods, isStripeCheckout)
  };
}
