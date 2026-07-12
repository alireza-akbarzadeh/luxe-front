/* eslint-disable @typescript-eslint/no-explicit-any */
// app/checkout/hooks/useCheckoutForm.ts
import { useEffect, useMemo, useRef } from 'react';

import { normalizePhoneForInput } from '@/lib/phone-utils';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { useGetAccountSummary } from '~/src/services/-account-summary-get';

import { createCheckoutSchema } from '../schemas/checkout.schema';
import type { CheckoutFormValues } from '../types/checkout.types';
import { useStripeCheckoutEnabled } from './useStripeCheckoutEnabled';

interface UseCheckoutFormArgs {
  onSubmit: (values: CheckoutFormValues) => Promise<void> | void;
}

export function useCheckoutForm({ onSubmit }: UseCheckoutFormArgs) {
  const hydratedRef = useRef(false);
  const stripeHydratedRef = useRef(false);
  const { data: summaryData } = useGetAccountSummary();
  const { isStripeCheckout } = useStripeCheckoutEnabled();

  const checkoutValidator = useMemo(
    () => createCheckoutSchema(isStripeCheckout) as any,
    [isStripeCheckout]
  );

  const defaultAddress = summaryData?.data?.default_shipping_address;
  const userEmail = summaryData?.data?.email;
  const userFirstName = summaryData?.data?.first_name;
  const userLastName = summaryData?.data?.last_name;
  const userPhone = summaryData?.data?.phone;

  const initialValues: CheckoutFormValues = {
    email: userEmail || '',
    firstName: userFirstName || '',
    lastName: userLastName || '',
    phone: normalizePhoneForInput(userPhone) ?? userPhone ?? '',
    newsletter: false,
    saveInfo: false,
    shippingAddressId: defaultAddress?.id ?? null,

    addressLine1: defaultAddress?.address_line1 || '',
    addressLine2: defaultAddress?.address_line2 || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    zip: defaultAddress?.postal_code || '',
    country: defaultAddress?.country || 'United States',
    couponCode: '',

    paymentMethod: 'stripe',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',

    shippingProviderId: null
  };

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: checkoutValidator,
      onChange: checkoutValidator,
      onBlur: checkoutValidator
    },

    onSubmit: async ({ value }) => {
      await onSubmit(value);
    }
  });

  useEffect(() => {
    if (stripeHydratedRef.current) return;
    if (isStripeCheckout) {
      form.setFieldValue('paymentMethod', 'stripe');
      stripeHydratedRef.current = true;
    }
  }, [form, isStripeCheckout]);

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
      phone: normalizePhoneForInput(userPhone) ?? userPhone ?? '',
      shippingAddressId: defaultAddress?.id ?? null
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
