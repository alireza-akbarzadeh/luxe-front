import { z } from 'zod';

export const checkoutSchema = z.object({
  // --- UI fields (not sent to backend) ---
  email: z.string().email().optional(), // if you still want to display it
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  newsletter: z.boolean().default(false),
  saveInfo: z.boolean().default(false),

  // --- Backend fields ---
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional().default(''),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),

  // coupon
  couponCode: z.string().optional().default(''),

  // payment
  paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal', 'gift_card', 'store_credit']),
  cardNumber: z.string().min(16).max(19, 'Card number must be 16-19 digits'),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Month must be 01-12'),
  expiryYear: z.string().regex(/^\d{4}$/, 'Year must be 4 digits'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),

  // shipping
  shippingProviderId: z.number().nullable().optional()
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const checkoutDefaultValues: CheckoutFormValues = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  newsletter: false,
  saveInfo: false,
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
