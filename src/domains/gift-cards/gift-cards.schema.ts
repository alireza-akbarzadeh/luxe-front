import { z } from 'zod';

export const GIFT_CARD_AMOUNTS = [50, 75, 100, 150, 200, 250] as const;

export const giftCardPurchaseSchema = z.object({
  amount: z.number().min(25).max(500),
  recipientEmail: z.string().email('Enter a valid recipient email'),
  recipientName: z.string().min(1, 'Recipient name is required'),
  senderName: z.string().min(1, 'Your name is required'),
  message: z.string().max(240).optional(),
  deliveryDate: z.string().optional()
});

export type GiftCardPurchaseValues = z.infer<typeof giftCardPurchaseSchema>;

export const giftCardRedeemSchema = z.object({
  code: z
    .string()
    .min(8, 'Enter your gift card code')
    .max(32)
    .regex(/^[A-Za-z0-9-]+$/, 'Code can only contain letters, numbers, and dashes')
});

export type GiftCardRedeemValues = z.infer<typeof giftCardRedeemSchema>;
