const STORAGE_KEY = 'luxe:plus-stripe-session';

/** Persist Stripe session id before redirect so confirm can retry after URL cleanup. */
export function persistPlusStripeSession(sessionId: string) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  } catch {
    // ignore quota / private mode
  }
}

export function readPlusStripeSession(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearPlusStripeSession() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
