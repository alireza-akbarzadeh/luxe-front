/**
 * Checkout helpers for presenting and lightly normalising card input.
 * These are UI/formatting only — never used for real payment processing.
 */

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

const CARD_BRAND_LABELS: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
  unknown: 'Card'
};

/** Best-effort brand detection from the leading digits of a card number. */
export function detectCardBrand(cardNumber: string): CardBrand {
  const digits = cardNumber.replace(/\D/g, '');
  if (/^4/.test(digits)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^6(?:011|5)/.test(digits)) return 'discover';
  return 'unknown';
}

export function getCardBrandLabel(brand: CardBrand): string {
  return CARD_BRAND_LABELS[brand];
}

/** Groups digits for display (4-4-4-4, or 4-6-5 for Amex). */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  const brand = detectCardBrand(digits);
  const groups = brand === 'amex' ? [4, 6, 5] : [4, 4, 4, 4, 3];

  const parts: string[] = [];
  let cursor = 0;
  for (const size of groups) {
    if (cursor >= digits.length) break;
    parts.push(digits.slice(cursor, cursor + size));
    cursor += size;
  }
  return parts.join(' ');
}

/** Returns the last four digits, or `null` when unavailable. */
export function getCardLast4(cardNumber: string): string | null {
  const digits = cardNumber.replace(/\D/g, '');
  return digits.length >= 4 ? digits.slice(-4) : null;
}

/** Masked representation for the review step, e.g. "•••• •••• •••• 4242". */
export function maskCardNumber(cardNumber: string): string {
  const last4 = getCardLast4(cardNumber);
  if (!last4) return '•••• ••••';
  return `•••• •••• •••• ${last4}`;
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  credit_card: 'Credit Card',
  debit_card: 'Debit Card',
  paypal: 'PayPal',
  gift_card: 'Gift Card',
  store_credit: 'Store Credit'
};

export function getPaymentMethodLabel(method: string): string {
  return PAYMENT_METHOD_LABELS[method] ?? 'Card';
}

export const CARD_PAYMENT_METHODS = ['credit_card', 'debit_card'] as const;

export function paymentMethodRequiresCard(method: string): boolean {
  return (CARD_PAYMENT_METHODS as readonly string[]).includes(method);
}
