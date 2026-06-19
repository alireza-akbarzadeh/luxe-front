import { z } from 'zod';

export const shippingProviderFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  price: z.number().min(0, 'Price must be zero or greater'),
  is_active: z.boolean()
});

export type ShippingProviderFormValues = z.infer<typeof shippingProviderFormSchema>;

export const shippingProviderDefaultValues: ShippingProviderFormValues = {
  name: '',
  description: '',
  price: 0,
  is_active: true
};
