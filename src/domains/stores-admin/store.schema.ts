import { z } from 'zod';

export const storeFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must be at most 120 characters'),
  description: z.string().max(2000, 'Description must be at most 2000 characters').optional(),
  logo_url: z
    .string()
    .max(2048)
    .refine((value) => value === '' || /^https?:\/\//.test(value), 'Enter a valid logo URL')
    .optional(),
  banner_url: z
    .string()
    .max(2048)
    .refine((value) => value === '' || /^https?:\/\//.test(value), 'Enter a valid banner URL')
    .optional(),
  location: z.string().max(200).optional(),
  shipping_info: z.string().max(1000).optional(),
  return_policy: z.string().max(2000).optional(),
  category_ids: z.array(z.string()).optional(),
  is_verified: z.boolean().optional()
});

export type StoreFormValues = z.infer<typeof storeFormSchema>;

export const storeDefaultValues: StoreFormValues = {
  name: '',
  description: '',
  logo_url: '',
  banner_url: '',
  location: '',
  shipping_info: '',
  return_policy: '',
  category_ids: [],
  is_verified: false
};
