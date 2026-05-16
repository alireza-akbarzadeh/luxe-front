import { z } from 'zod';

export const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().default(''),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone is required'),
  shippingMethod: z.enum(['standard', 'express', 'overnight']),
  cardNumber: z.string().min(1, 'Card number is required'),
  cardName: z.string().min(1, 'Name on card is required'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date (MM/YY)'),
  cvc: z.string().regex(/^\d{3,4}$/, 'Invalid CVC'),
  saveInfo: z.boolean().default(false),
  newsletter: z.boolean().default(false),
  couponCode: z.string().default('')
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
