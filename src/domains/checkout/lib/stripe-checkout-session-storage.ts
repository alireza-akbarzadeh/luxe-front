const storageKey = (orderId: string | number) => `luxe:stripe-order-session:${orderId}`;

/** Persist Stripe Checkout session id before redirect so confirm can retry after URL cleanup. */
export function persistStripeCheckoutSession(orderId: string | number, sessionId: string) {
  if (typeof window === 'undefined') return;
  const trimmed = sessionId.trim();
  if (!trimmed) return;
  try {
    sessionStorage.setItem(storageKey(orderId), trimmed);
  } catch {
    // Private browsing or quota — confirm can still use URL params on first load.
  }
}

export function readStripeCheckoutSession(orderId: string | number): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(storageKey(orderId))?.trim() ?? null;
  } catch {
    return null;
  }
}

export function clearStripeCheckoutSession(orderId: string | number) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(storageKey(orderId));
  } catch {
    // ignore
  }
}
