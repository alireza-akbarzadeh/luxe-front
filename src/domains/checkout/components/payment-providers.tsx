'use client';

import { useCheckoutPaymentMethods } from '../hooks/use-checkout-payment-methods';
import type { CheckoutFormValues } from '../types/checkout.types';
import { CheckoutPaymentMethodPicker } from './checkout-payment-method-picker';

interface PaymentMethodSelectorProps {
  value: CheckoutFormValues['paymentMethod'];
  onChange: (value: CheckoutFormValues['paymentMethod']) => void;
}

/** @deprecated Prefer CheckoutPaymentSection — kept for legacy imports. */
export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const { methods, isLoading, error } = useCheckoutPaymentMethods();

  if (error) {
    return (
      <div className='text-destructive mb-6 text-sm'>
        Failed to load payment methods. Please refresh.
      </div>
    );
  }

  return (
    <CheckoutPaymentMethodPicker
      methods={methods}
      value={value}
      onChange={onChange}
      isLoading={isLoading}
    />
  );
}
