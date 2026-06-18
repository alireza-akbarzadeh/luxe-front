import { z } from 'zod';

export const assignUserRoleSchema = z.object({
  role: z.string().min(1, 'Select a role')
});

export type AssignUserRoleValues = z.infer<typeof assignUserRoleSchema>;
