'use client';

import { useGetPaymentProviders } from '@/services/-payment-providers-get';

/** Fetches enabled payment providers for checkout. */
export function usePaymentProviders() {
  const { data: response, isLoading, error } = useGetPaymentProviders();

  return {
    providers: response?.data ?? [],
    isLoading,
    error
  };
}
