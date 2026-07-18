import { z } from 'zod';

export const GIFT_CARD_AMOUNTS = [50, 75, 100, 150, 200, 250, 500] as const;

/** Inclusive bounds for preset and custom gift card amounts. */
export const GIFT_CARD_MIN_AMOUNT = 25;
export const GIFT_CARD_MAX_AMOUNT = 5_000;

export const giftCardPurchaseSchema = z.object({
  amount: z
    .number({ error: 'Enter an amount' })
    .int('Amount must be a whole number (no cents)')
    .min(GIFT_CARD_MIN_AMOUNT, `Minimum amount is $${GIFT_CARD_MIN_AMOUNT}`)
    .max(GIFT_CARD_MAX_AMOUNT, `Maximum amount is $${GIFT_CARD_MAX_AMOUNT}`),
  recipientEmail: z.string().email('Enter a valid recipient email'),
  recipientName: z.string().min(1, 'Recipient name is required'),
  senderName: z.string().min(1, 'Your name is required'),
  message: z.string().max(240),
  deliveryDate: z.string()
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
