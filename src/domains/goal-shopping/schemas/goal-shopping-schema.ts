import { z } from 'zod';

export type GoalShoppingFormValues = {
  goal: string;
  timeline?: string;
  preferences?: string;
  budget_min?: number;
  budget_max?: number;
};

export const emptyGoalShoppingForm: GoalShoppingFormValues = {
  goal: '',
  timeline: '',
  preferences: '',
  budget_min: undefined,
  budget_max: undefined
};

/** Submit-time validation — keep defaults permissive so the form can mount empty. */
export function createGoalShoppingSchema(goalTooShortMessage: string) {
  return z.object({
    goal: z.string().min(3, goalTooShortMessage),
    timeline: z.string().optional(),
    preferences: z.string().optional(),
    budget_min: z.number().min(0).optional(),
    budget_max: z.number().min(0).optional()
  });
}
