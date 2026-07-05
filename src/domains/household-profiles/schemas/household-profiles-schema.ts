import { z } from 'zod';

export type HouseholdMemberFormValues = {
  name: string;
  relationship: string;
  sizes: string;
  preferences: string;
  interests: string;
};

export const emptyHouseholdMemberForm: HouseholdMemberFormValues = {
  name: '',
  relationship: '',
  sizes: '',
  preferences: '',
  interests: ''
};

export type HouseholdShoppingFormValues = {
  context: string;
  budget_min?: number;
  budget_max?: number;
};

export const emptyHouseholdShoppingForm: HouseholdShoppingFormValues = {
  context: '',
  budget_min: undefined,
  budget_max: undefined
};

/** Validates a new household member before adding to the local profile list. */
export function createHouseholdMemberSchema(nameTooShortMessage: string) {
  return z.object({
    name: z.string().min(2, nameTooShortMessage),
    relationship: z.string(),
    sizes: z.string(),
    preferences: z.string(),
    interests: z.string()
  });
}
