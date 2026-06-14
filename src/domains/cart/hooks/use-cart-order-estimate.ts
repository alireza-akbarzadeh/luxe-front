'use client';

import { useMemo } from 'react';

import type { DtoCartItemDetail } from '~/src/services/-cart-get.schemas';

import { calculateCartTotals, getFreeShippingRemaining } from '../lib/cart-utils';
import { useCartCommerceSettings } from './use-cart-commerce-settings';

/** Combines cart subtotal/items with commerce settings for shipping + estimated total. */
export function useCartOrderEstimate(items: DtoCartItemDetail[], subtotal: number) {
  const { settings, isLoading, isError, refetch } = useCartCommerceSettings();

  const estimate = useMemo(
    () => calculateCartTotals(items, subtotal, settings),
    [items, subtotal, settings]
  );

  const freeShippingRemaining = useMemo(
    () => getFreeShippingRemaining(subtotal, settings.freeShippingThreshold),
    [subtotal, settings.freeShippingThreshold]
  );

  return {
    ...estimate,
    settings,
    freeShippingRemaining,
    hasFreeShipping: subtotal >= settings.freeShippingThreshold,
    isSettingsLoading: isLoading,
    isSettingsError: isError,
    refetchSettings: refetch
  };
}
