/** API response shape for POST /gift-cards (includes Stripe checkout when payment is pending). */
export type GiftCardCreateResponseData = {
  checkout_url?: string;
  status?: string;
};

/** Formats a DatePicker value for the gift card API (`YYYY-MM-DD`). */
export function formatGiftCardDeliveryDate(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getGiftCardCheckoutUrl(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const url = (data as GiftCardCreateResponseData).checkout_url;
  return typeof url === 'string' && url.trim().length > 0 ? url.trim() : null;
}

/** Redirects to Stripe when `checkout_url` is present; otherwise returns false. */
export function redirectToGiftCardCheckout(data: unknown): boolean {
  const checkoutUrl = getGiftCardCheckoutUrl(data);
  if (!checkoutUrl) return false;
  window.location.assign(checkoutUrl);
  return true;
}
