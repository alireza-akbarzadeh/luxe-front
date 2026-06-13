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
  is_active: z.boolean()
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const categoryDefaultValues: CategoryFormValues = {
  name: '',
  slug: '',
  description: '',
  parent_id: null,
  is_active: true
};
