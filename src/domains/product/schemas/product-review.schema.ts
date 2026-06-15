import { z } from 'zod';

export const productReviewSchema = z.object({
  rating: z.number().int().min(1, 'Select a star rating').max(5),
  title: z.string().trim().max(120, 'Title is too long'),
  comment: z
    .string()
    .trim()
    .min(3, 'Comment must be at least 3 characters')
    .max(2000, 'Comment is too long')
});

export type ProductReviewFormValues = z.infer<typeof productReviewSchema>;

export const defaultProductReviewValues: ProductReviewFormValues = {
  rating: 5,
  title: '',
  comment: ''
};
