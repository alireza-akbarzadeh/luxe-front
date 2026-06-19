import { z } from 'zod';

export const walletAdjustFormSchema = z.object({
  user_id: z.string().min(1, 'Select a customer'),
  amount: z
    .number({ error: 'Enter an amount' })
    .refine((value) => value !== 0, 'Amount cannot be zero'),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters')
    .max(500, 'Description must be at most 500 characters')
});

export type WalletAdjustFormValues = z.infer<typeof walletAdjustFormSchema>;

export const walletAdjustDefaultValues: WalletAdjustFormValues = {
  user_id: '',
  amount: 0,
  description: ''
};
