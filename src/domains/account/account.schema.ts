import { z } from 'zod';

export const addressFormSchema = z.object({
  label: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  street: z.string().min(1, 'Street address is required'),
  apartment: z.string(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone number is required'),
  address_type: z.enum(['both', 'billing', 'shipping']),
  isDefault: z.boolean()
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

export const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email(),
  phone: z.string()
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
