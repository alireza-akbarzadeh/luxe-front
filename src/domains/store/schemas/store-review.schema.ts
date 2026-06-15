import { z } from 'zod';

export const storeReviewSchema = z.object({
  rating: z.number().int().min(1, 'Select a star rating').max(5),
  comment: z
    .string()
    .trim()
    .min(3, 'Comment must be at least 3 characters')
    .max(2000, 'Comment is too long')
});

export type StoreReviewFormValues = z.infer<typeof storeReviewSchema>;

export const defaultStoreReviewValues: StoreReviewFormValues = {
  rating: 5,
  comment: ''
};
