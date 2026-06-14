'use client';

import { useMemo } from 'react';

import { useCartCommerceSettings } from '@/domains/cart/hooks/use-cart-commerce-settings';
import { calculateEstimatedTax } from '@/domains/cart/lib/cart-utils';
import { useCartController } from '~/src/hooks/useCartController';

import { useCheckoutStore } from '../store/checkout.store';

export function useCheckoutTotals() {
  const { items } = useCartController();
  const { selectedShippingPrice, couponDiscount } = useCheckoutStore();
  const { settings } = useCartCommerceSettings();

  return useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0);
    const tax = calculateEstimatedTax(subtotal, settings);
    const total = subtotal + selectedShippingPrice + tax - couponDiscount;

    return { subtotal, tax, total, shippingPrice: selectedShippingPrice, couponDiscount, settings };
  }, [items, selectedShippingPrice, couponDiscount, settings]);
}
