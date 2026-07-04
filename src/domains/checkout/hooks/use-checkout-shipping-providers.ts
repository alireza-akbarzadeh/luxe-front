'use client';

import { useCartCommerceSettings } from '@/domains/cart/hooks/use-cart-commerce-settings';
import { qualifiesForFreeShipping } from '@/domains/cart/lib/cart-utils';
import { useCartController } from '@/hooks/useCartController';
import { useGetShippingProviders } from '@/services/-shipping-providers-get';

/** Shipping provider list + cart context for checkout shipping step. */
export function useCheckoutShippingProviders() {
  const { subtotal } = useCartController();
  const { settings } = useCartCommerceSettings();
  const { data: providersData, isLoading } = useGetShippingProviders();

  return {
    providers: providersData?.data ?? [],
    isLoading,
    subtotal,
    settings,
    hasFreeShipping: qualifiesForFreeShipping(subtotal, settings.freeShippingThreshold)
  };
}
