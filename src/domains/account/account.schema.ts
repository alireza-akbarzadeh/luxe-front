import { z } from 'zod';

import { phoneE164String } from '@/schemas/phone.schema';

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
  phone: phoneE164String(),
  address_type: z.enum(['both', 'billing', 'shipping']),
  isDefault: z.boolean()
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

export const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email(),
  phone: phoneE164String({ required: false })
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const walletDepositSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, 'Amount is required')
    .refine((value) => {
      const parsed = Number(value);
      return !Number.isNaN(parsed) && parsed > 0;
    }, 'Enter a valid amount')
    .refine((value) => Number(value) <= 50_000, 'Maximum deposit is $50,000')
});

export type WalletDepositValues = z.infer<typeof walletDepositSchema>;

export const walletWithdrawSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, 'Amount is required')
    .refine((value) => {
      const parsed = Number(value);
      return !Number.isNaN(parsed) && parsed > 0;
    }, 'Enter a valid amount'),
  description: z.string().max(200, 'Description is too long').optional()
});

export type WalletWithdrawValues = z.infer<typeof walletWithdrawSchema>;
