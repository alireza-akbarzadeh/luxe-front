import type { CheckoutStepId } from '~/src/domains/checkout/checkout.schema';

import { type CheckoutFormValues, createCheckoutSchema } from '../schemas/checkout.schema';

/** Fields validated before advancing past each wizard step. */
export const checkoutStepFields: Record<CheckoutStepId, (keyof CheckoutFormValues)[]> = {
  shipping: [
    'email',
    'firstName',
    'lastName',
    'phone',
    'addressLine1',
    'city',
    'state',
    'zip',
    'country',
    'shippingProviderId'
  ],
  review: []
};

/** Card / payment-method fields — validated at place-order when not using Stripe Checkout. */
export const CHECKOUT_PAYMENT_FIELD_KEYS = [
  'paymentMethod',
  'cardNumber',
  'expiryMonth',
  'expiryYear',
  'cvv'
] as const satisfies readonly (keyof CheckoutFormValues)[];

export function getCheckoutStepFields(
  stepId: CheckoutStepId,
  _stripeCheckout = false
): (keyof CheckoutFormValues)[] {
  return checkoutStepFields[stepId];
}

/** Collects schema errors for demo card entry (non-Stripe checkout). */
export function getCheckoutPaymentErrors(
  values: CheckoutFormValues,
  stripeCheckout = false
): Partial<Record<keyof CheckoutFormValues, string[]>> {
  if (stripeCheckout) return {};

  const parsed = createCheckoutSchema(false).safeParse(values);
  if (parsed.success) return {};

  const errors: Partial<Record<keyof CheckoutFormValues, string[]>> = {};
  const fields = CHECKOUT_PAYMENT_FIELD_KEYS as readonly (keyof CheckoutFormValues)[];

  for (const issue of parsed.error.issues) {
    const fieldName = issue.path[0];
    if (typeof fieldName !== 'string') continue;
    if (!fields.includes(fieldName as keyof CheckoutFormValues)) continue;

    const key = fieldName as keyof CheckoutFormValues;
    errors[key] = [...(errors[key] ?? []), issue.message];
  }

  return errors;
}

/** Collects schema errors scoped to a single checkout step (includes superRefine rules). */
export function getCheckoutStepErrors(
  values: CheckoutFormValues,
  stepId: CheckoutStepId,
  options?: { stripeCheckout?: boolean }
): Partial<Record<keyof CheckoutFormValues, string[]>> {
  const fields = getCheckoutStepFields(stepId, options?.stripeCheckout ?? false);
  const parsed = createCheckoutSchema(options?.stripeCheckout ?? false).safeParse(values);

  if (parsed.success) return {};

  const errors: Partial<Record<keyof CheckoutFormValues, string[]>> = {};

  for (const issue of parsed.error.issues) {
    const fieldName = issue.path[0];
    if (typeof fieldName !== 'string') continue;
    if (!fields.includes(fieldName as keyof CheckoutFormValues)) continue;

    const key = fieldName as keyof CheckoutFormValues;
    errors[key] = [...(errors[key] ?? []), issue.message];
  }

  return errors;
}
