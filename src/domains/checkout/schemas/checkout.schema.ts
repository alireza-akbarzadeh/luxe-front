import { z } from 'zod';

import { phoneE164String } from '@/schemas/phone.schema';

const CARD_PAYMENT_METHODS = ['credit_card', 'debit_card'] as const;

const checkoutBaseSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: phoneE164String(),
  newsletter: z.boolean().default(false),
  saveInfo: z.boolean().default(false),
  shippingAddressId: z.number().int().positive().nullable().default(null),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional().default(''),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  couponCode: z.string().optional().default(''),
  /** Dynamic provider id from catalog / settings / payment-providers API. */
  paymentMethod: z.string().min(1, 'Select a payment method'),
  cardNumber: z.string().optional().default(''),
  expiryMonth: z.string().optional().default(''),
  expiryYear: z.string().optional().default(''),
  cvv: z.string().optional().default(''),
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
  paymentMethod: 'stripe',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  shippingProviderId: null
};
