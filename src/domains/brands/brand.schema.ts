import { z } from 'zod';

export const BRAND_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Archived', value: 'archived' }
] as const;

export const brandStatusSchema = z.enum(['draft', 'active', 'inactive', 'archived']);

export const brandFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must be at most 100 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens only'
    ),
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  logo_url: z
    .string()
    .max(2048)
    .refine((value) => value === '' || /^https?:\/\//.test(value), 'Enter a valid logo URL')
    .optional(),
  status: brandStatusSchema
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;

export const brandDefaultValues: BrandFormValues = {
  name: '',
  slug: '',
  description: '',
  logo_url: '',
  status: 'draft'
};
