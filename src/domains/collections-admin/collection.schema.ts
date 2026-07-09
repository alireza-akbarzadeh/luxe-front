import { z } from 'zod';

export const COLLECTION_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Archived', value: 'archived' }
] as const;

export const COLLECTION_PREVIEW_SORT_NONE = 'none' as const;

export const COLLECTION_PREVIEW_SORT_OPTIONS = [
  { label: 'None', value: COLLECTION_PREVIEW_SORT_NONE },
  { label: 'Newest', value: 'newest' },
  { label: 'Top rated', value: 'rating_desc' },
  { label: 'Most reviews', value: 'reviews_desc' },
  { label: 'Price: low to high', value: 'price_asc' },
  { label: 'Price: high to low', value: 'price_desc' }
] as const;

export const COLLECTION_THEME_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Lifestyle', value: 'lifestyle' },
  { label: 'Editorial', value: 'editorial' },
  { label: 'Sale', value: 'sale' },
  { label: 'Seasonal', value: 'seasonal' },
  { label: 'Minimal', value: 'minimal' }
] as const;

export const collectionStatusSchema = z.enum(['draft', 'active', 'inactive', 'archived']);

export const collectionFormSchema = z.object({
  eyebrow: z.string().max(128, 'Eyebrow must be at most 128 characters').optional(),
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(255, 'Title must be at most 255 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(128, 'Slug must be at most 128 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens only'
    ),
  description: z.string().max(2000, 'Description must be at most 2000 characters').optional(),
  href: z
    .string()
    .max(512)
    .refine((value) => value === '' || value.startsWith('/'), 'Href must start with /')
    .optional(),
  image_url: z
    .string()
    .max(2048)
    .refine((value) => value === '' || /^https?:\/\//.test(value), 'Enter a valid image URL')
    .optional(),
  cta_label: z.string().max(128).optional(),
  sort_order: z.number().int().min(0).max(9999),
  theme: z.string().max(64).optional(),
  status: collectionStatusSchema,
  preview_sort: z.string().max(64).optional(),
  preview_is_new: z.boolean(),
  preview_category_id: z.string()
});

export type CollectionFormValues = z.infer<typeof collectionFormSchema>;

export const COLLECTION_CATEGORY_NONE = 'none' as const;

export const collectionDefaultValues: CollectionFormValues = {
  eyebrow: '',
  title: '',
  slug: '',
  description: '',
  href: '/shop',
  image_url: '',
  cta_label: 'Shop collection',
  sort_order: 0,
  theme: '',
  status: 'draft',
  preview_sort: COLLECTION_PREVIEW_SORT_NONE,
  preview_is_new: false,
  preview_category_id: COLLECTION_CATEGORY_NONE
};
