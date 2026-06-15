'use client';

import { useMemo } from 'react';

import { useCartCommerceSettings } from '@/domains/cart/hooks/use-cart-commerce-settings';
import { calculateEstimatedTax, getEffectiveShippingPrice } from '@/domains/cart/lib/cart-utils';
import { useCartController } from '~/src/hooks/useCartController';
import { useGetShippingProviders } from '~/src/services/-shipping-providers-get';

import { useCheckoutStore } from '../store/checkout.store';

/**
 * Single source of truth for checkout order totals.
 *
 * Subtotal/discount come from the cart + applied coupon, shipping from the
 * selected provider, and tax from the commerce settings rate. Pass the
 * currently selected `shippingProviderId` (from the form) so the figure stays
 * in sync across the summary, payment and review steps.
 */
export function useCheckoutTotals(shippingProviderId?: number | null) {
  const { items } = useCartController();
  const { couponDiscount, appliedCouponCode } = useCheckoutStore();
  const { data: providersData } = useGetShippingProviders();
  const { settings } = useCartCommerceSettings();

  return useMemo(() => {
    const selectedProvider =
      providersData?.data?.find((provider) => provider.id === shippingProviderId) ?? null;
    const providerRate = selectedProvider?.price ?? 0;

    const subtotal = items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0);
    const shippingPrice = getEffectiveShippingPrice(providerRate, subtotal, settings);
    const hasFreeShipping = shippingPrice === 0 && providerRate > 0;
    const tax = calculateEstimatedTax(subtotal, settings);
    const total = Math.max(0, subtotal + shippingPrice + tax - couponDiscount);

    return {
      subtotal,
      shippingPrice,
      providerRate,
      hasFreeShipping,
      tax,
      couponDiscount,
      appliedCouponCode,
      total,
      selectedProvider,
      settings
    };
  }, [items, providersData, shippingProviderId, settings, couponDiscount, appliedCouponCode]);
}
