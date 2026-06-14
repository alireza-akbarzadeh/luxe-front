/* eslint-disable @typescript-eslint/no-explicit-any */
// app/checkout/hooks/useCheckoutForm.ts
import { useEffect, useRef } from 'react';

import { useCartCommerceSettings } from '@/domains/cart/hooks/use-cart-commerce-settings';
import { calculateEstimatedTax } from '@/domains/cart/lib/cart-utils';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { useGetAccountSummary } from '~/src/services/-account-summary-get';
import { useGetShippingProviders } from '~/src/services/-shipping-providers-get';

import type { CheckoutFormValues } from '../checkout.schema';
import { checkoutSchema } from '../checkout.schema';

interface UseCheckoutFormArgs {
  onSubmit: (values: CheckoutFormValues) => Promise<void> | void;
}

export function useCheckoutForm({ onSubmit }: UseCheckoutFormArgs) {
  const hydratedRef = useRef(false);
  const { data: summaryData } = useGetAccountSummary();

  const defaultAddress = summaryData?.data?.default_shipping_address;
  const userEmail = summaryData?.data?.email;
  const userFirstName = summaryData?.data?.first_name;
  const userLastName = summaryData?.data?.last_name;
  const userPhone = summaryData?.data?.phone;

  const initialValues: CheckoutFormValues = {
    email: userEmail || '',
    firstName: userFirstName || '',
    lastName: userLastName || '',
    phone: userPhone || '',
    newsletter: false,
    saveInfo: false,

    addressLine1: defaultAddress?.address_line1 || '',
    addressLine2: defaultAddress?.address_line2 || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    zip: defaultAddress?.postal_code || '',
    country: defaultAddress?.country || 'United States',
    couponCode: '',

    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',

    shippingProviderId: null
  };

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: checkoutSchema as any,
      onChange: checkoutSchema as any,
      onBlur: checkoutSchema as any
    },

    onSubmit: async ({ value }) => {
      await onSubmit(value);
    }
  });

  // Hydrate form when user data loads (only once)
  useEffect(() => {
    if (!summaryData || hydratedRef.current) return;

    const updates: Partial<CheckoutFormValues> = {
      email: userEmail || '',
      firstName: userFirstName || '',
      lastName: userLastName || '',
      addressLine1: defaultAddress?.address_line1 || '',
      addressLine2: defaultAddress?.address_line2 || '',
      city: defaultAddress?.city || '',
      state: defaultAddress?.state || '',
      zip: defaultAddress?.postal_code || '',
      country: defaultAddress?.country || 'United States',
      phone: userPhone || ''
    };

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        form.setFieldValue(key as keyof CheckoutFormValues, value as never);
      }
    });

    hydratedRef.current = true;
  }, [summaryData, form, userEmail, userFirstName, userLastName, defaultAddress, userPhone]);

  return form;
}

export type CheckoutFormApi = ReturnType<typeof useCheckoutForm>;

// Also move useCheckoutTotals to a separate file or export from here
export function useCheckoutTotals({
  items,
  couponDiscount,
  shippingProviderId // number | null
}: {
  items: Array<{ price?: number; quantity?: number }>;
  couponDiscount: number;
  shippingProviderId: number | null;
}) {
  const { data: providersData } = useGetShippingProviders();
  const { settings } = useCartCommerceSettings();
  const shippingProvider = providersData?.data?.find((p) => p.id === shippingProviderId);
  const shippingPrice = shippingProvider?.price ?? 0;

  const subtotal = items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0);
  const tax = calculateEstimatedTax(subtotal, settings);
  const total = subtotal + shippingPrice + tax - couponDiscount;

  return { subtotal, tax, total, shippingPrice, settings };
}
