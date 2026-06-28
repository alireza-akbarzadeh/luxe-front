'use client';

import { useCallback } from 'react';

import type { CheckoutFormValues, CheckoutStepId } from '../checkout.schema';
import {
  getCheckoutPaymentErrors,
  getCheckoutStepErrors,
  getCheckoutStepFields
} from '../checkout.schema';
import type { CheckoutFormApi } from './useCheckoutForm';

/** Step-scoped and payment validation for the checkout wizard. */
export function useCheckoutValidation(form: CheckoutFormApi, isStripeCheckout: boolean) {
  const applyFieldErrors = useCallback(
    (fieldErrors: Partial<Record<keyof CheckoutFormValues, string[]>>) => {
      for (const [fieldName, messages] of Object.entries(fieldErrors)) {
        if (!messages?.length) continue;
        form.setFieldMeta(fieldName as keyof CheckoutFormValues, (prev) => ({
          ...prev,
          errors: messages,
          isTouched: true
        }));
      }
      return Object.keys(fieldErrors).length === 0;
    },
    [form]
  );

  const validateStep = useCallback(
    async (stepId: CheckoutStepId) => {
      const fields = getCheckoutStepFields(stepId, isStripeCheckout);
      await Promise.all(fields.map((name) => form.validateField(name, 'submit')));

      const stepErrors = getCheckoutStepErrors(form.state.values, stepId, {
        stripeCheckout: isStripeCheckout
      });

      if (!applyFieldErrors(stepErrors)) return false;

      const meta = form.state.fieldMeta;
      return fields.every((field) => !meta[field]?.errors?.length);
    },
    [form, isStripeCheckout, applyFieldErrors]
  );

  const validatePayment = useCallback(async () => {
    if (isStripeCheckout) return true;

    const paymentFields = getCheckoutPaymentErrors(form.state.values, false);
    if (!applyFieldErrors(paymentFields)) return false;

    const meta = form.state.fieldMeta;
    const keys = Object.keys(paymentFields) as (keyof CheckoutFormValues)[];
    return keys.every((field) => !meta[field]?.errors?.length);
  }, [form, isStripeCheckout, applyFieldErrors]);

  return { validateStep, validatePayment };
}
