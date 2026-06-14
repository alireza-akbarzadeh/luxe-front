'use client';

import { useGetSettings } from '@/services/-settings-get';

import {
  DEFAULT_CART_COMMERCE_SETTINGS,
  resolveCartCommerceSettings
} from '../lib/cart-commerce-settings';

/**
 * Loads cart shipping estimate settings from the public settings API.
 * Falls back to defaults when keys are missing or the request fails.
 */
export function useCartCommerceSettings() {
  const query = useGetSettings({
    query: {
      staleTime: 1000 * 60 * 5,
      select: (response) => resolveCartCommerceSettings(response.data)
    }
  });

  return {
    settings: query.data ?? DEFAULT_CART_COMMERCE_SETTINGS,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch
  };
}
