import { z } from 'zod';

export const checkoutAddressEditSchema = z.object({
  label: z.string(),
  addressLine1: z.string().min(1, 'Street address is required'),
  addressLine2: z.string(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required')
});

export type CheckoutAddressEditValues = z.infer<typeof checkoutAddressEditSchema>;

export const checkoutAddressEditDefaultValues: CheckoutAddressEditValues = {
  label: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
  country: ''
};
