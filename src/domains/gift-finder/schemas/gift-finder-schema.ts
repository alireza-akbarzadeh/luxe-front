import { z } from 'zod';

import type { GiftBudgetKey, GiftOccasion, GiftRecipient } from '../lib/gift-finder-options';

export const giftFinderDraftSchema = z.object({
  recipient: z.string().min(1),
  occasion: z.string().min(1),
  budgetKey: z.string().min(1),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  interests: z.string(),
  additionalNotes: z.string(),
  styleTags: z.array(z.string())
});

export type GiftFinderDraft = z.infer<typeof giftFinderDraftSchema>;

export const emptyGiftFinderDraft: GiftFinderDraft = {
  recipient: '',
  occasion: '',
  budgetKey: '',
  budgetMin: 0,
  budgetMax: 0,
  interests: '',
  additionalNotes: '',
  styleTags: []
};

export function isRecipient(value: string): value is GiftRecipient {
  return value.length > 0;
}

export function isOccasion(value: string): value is GiftOccasion {
  return value.length > 0;
}

export function isBudgetKey(value: string): value is GiftBudgetKey {
  return value.length > 0;
}
