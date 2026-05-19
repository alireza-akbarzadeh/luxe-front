// app/checkout/hooks/useCheckoutForm.ts
import { useEffect, useRef } from 'react';
import { useAppForm } from '~/src/components/forms/useAppForm';
import type { CheckoutFormValues } from '../checkout.schema';
import { checkoutSchema } from '../checkout.schema';
import { useGetAccountSummary } from '~/src/services/-account-summary-get';

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
    addressLine1: defaultAddress?.address_line1 || '',
    addressLine2: defaultAddress?.address_line2 || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    zip: defaultAddress?.postal_code || '',
    country: defaultAddress?.country || 'United States',
    phone: userPhone || '',
    shippingMethod: 'standard',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
    saveInfo: false,
    newsletter: false,
    couponCode: '',
  };

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: checkoutSchema as any,
      onChange: checkoutSchema as any,
      onBlur: checkoutSchema as any,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
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
      phone: userPhone || '',
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

// Also move useCheckoutTotals to a separate file or export from here
export function useCheckoutTotals({
  items,
  shippingPrice,
  couponDiscount,
}: {
  items: Array<{ price?: number; quantity?: number }>;
  shippingPrice: number;
  couponDiscount: number;
}) {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + shippingPrice + tax - couponDiscount;
  return { subtotal, tax, total };
}
