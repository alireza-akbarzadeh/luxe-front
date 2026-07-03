import { z } from 'zod';

const CARD_PAYMENT_METHODS = ['credit_card', 'debit_card'] as const;

const checkoutBaseSchema = z.object({
  // --- Contact ---
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  newsletter: z.boolean().default(false),
  saveInfo: z.boolean().default(false),

  // --- Shipping address ---
  /** Saved address id when selected from account; null when entering manually. Not sent to API. */
  shippingAddressId: z.number().int().positive().nullable().default(null),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional().default(''),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),

  // --- Coupon ---
  couponCode: z.string().optional().default(''),

  // --- Payment ---
  paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal', 'gift_card', 'store_credit']),
  cardNumber: z.string().optional().default(''),
  expiryMonth: z.string().optional().default(''),
  expiryYear: z.string().optional().default(''),
  cvv: z.string().optional().default(''),

  // --- Shipping method ---
  shippingProviderId: z.number().int().positive().nullable()
});

function withCheckoutRefinements(stripeCheckout: boolean) {
  return checkoutBaseSchema.superRefine((val, ctx) => {
    if (val.shippingProviderId == null) {
      ctx.addIssue({
        code: 'custom',
        path: ['shippingProviderId'],
        message: 'Select a shipping method'
      });
    }

    const requiresCard =
      !stripeCheckout && (CARD_PAYMENT_METHODS as readonly string[]).includes(val.paymentMethod);
    if (!requiresCard) return;

    const digits = (val.cardNumber ?? '').replace(/\s/g, '');
    if (!/^\d{16,19}$/.test(digits)) {
      ctx.addIssue({
        code: 'custom',
        path: ['cardNumber'],
        message: 'Enter a valid 16–19 digit card number'
      });
    }

    const monthValid = /^(0[1-9]|1[0-2])$/.test(val.expiryMonth ?? '');
    const yearValid = /^\d{4}$/.test(val.expiryYear ?? '');

    if (!monthValid) {
      ctx.addIssue({ code: 'custom', path: ['expiryMonth'], message: 'MM' });
    }
    if (!yearValid) {
      ctx.addIssue({ code: 'custom', path: ['expiryYear'], message: 'YYYY' });
    }

    if (monthValid && yearValid) {
      const month = Number(val.expiryMonth);
      const year = Number(val.expiryYear);
      const expiresAt = new Date(year, month, 0, 23, 59, 59);
      if (expiresAt.getTime() < Date.now()) {
        ctx.addIssue({ code: 'custom', path: ['expiryYear'], message: 'Card has expired' });
      }
    }

    if (!/^\d{3,4}$/.test(val.cvv ?? '')) {
      ctx.addIssue({ code: 'custom', path: ['cvv'], message: 'Invalid CVV' });
    }
  });
}

export function createCheckoutSchema(stripeCheckout = false) {
  return withCheckoutRefinements(stripeCheckout);
}

export const checkoutSchema = createCheckoutSchema(false);

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const checkoutDefaultValues: CheckoutFormValues = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  newsletter: false,
  saveInfo: false,
  shippingAddressId: null,
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
  country: 'United States',
  couponCode: '',
  paymentMethod: 'credit_card',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  shippingProviderId: null
};

// ─── Step navigation + per-step validation ──────────────────────────────────

export const CHECKOUT_STEP_IDS = ['shipping', 'review'] as const;
export type CheckoutStepId = (typeof CHECKOUT_STEP_IDS)[number];

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

/** Payment step has no required fields when Stripe Checkout handles card entry. */
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
