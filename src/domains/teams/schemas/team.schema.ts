import { z } from 'zod';

export const teamSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and hyphens only'),
  description: z.string().max(500).default('')
});

export type TeamFormValues = z.infer<typeof teamSchema>;

export const teamDefaults: TeamFormValues = {
  name: '',
  slug: '',
  description: ''
};

export const teamEditSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  description: z.string().max(500).default('')
});

export type TeamEditFormValues = z.infer<typeof teamEditSchema>;

export const teamEditDefaults: TeamEditFormValues = {
  name: '',
  description: ''
};

export const addTeamMemberSchema = z.object({
  user_id: z.string().min(1, 'Select a user'),
  role: z.enum(['member', 'lead']).default('member')
});

export type AddTeamMemberFormValues = z.infer<typeof addTeamMemberSchema>;

export const addTeamMemberDefaults: AddTeamMemberFormValues = {
  user_id: '',
  role: 'member'
};

export function slugifyTeamName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
