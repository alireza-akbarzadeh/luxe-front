import { z } from 'zod';

export const categoryFormSchema = z.object({
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
  parent_id: z.string().nullable().optional(),
  is_active: z.boolean(),
  icon: z.string().max(64, 'Icon name must be at most 64 characters').optional(),
  image_url: z.string().max(512).optional(),
  meta_title: z.string().max(70, 'Meta title must be at most 70 characters').optional(),
  meta_description: z
    .string()
    .max(160, 'Meta description must be at most 160 characters')
    .optional()
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const categoryDefaultValues: CategoryFormValues = {
  name: '',
  slug: '',
  description: '',
  parent_id: null,
  is_active: true,
  icon: '',
  image_url: '',
  meta_title: '',
  meta_description: ''
};
