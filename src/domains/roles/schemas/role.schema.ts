import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and hyphens only'),
  description: z.string().max(500).default('')
});

export type RoleFormValues = z.infer<typeof roleSchema>;

export const roleDefaults: RoleFormValues = {
  name: '',
  slug: '',
  description: ''
};

export const roleEditSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  description: z.string().max(500).default('')
});

export type RoleEditFormValues = z.infer<typeof roleEditSchema>;

export const roleEditDefaults: RoleEditFormValues = {
  name: '',
  description: ''
};

export function slugifyRoleName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
