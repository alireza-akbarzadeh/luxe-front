import type { PostPlusSubscribe200 } from '@/services/-plus-subscribe-post.schemas';

function normalizeSubscribePayload(response: unknown): Record<string, unknown> | null {
  if (!response || typeof response !== 'object') return null;

  const root = response as Record<string, unknown>;
  const data = root['data'];

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }

  return root;
}

/** Stripe Checkout redirect when Plus subscribe returns a pending card payment. */
export function resolvePlusStripeRedirect(
  response: PostPlusSubscribe200 | unknown
): { checkoutUrl: string; stripeSessionId?: string } | null {
  const payload = normalizeSubscribePayload(response);
  if (!payload) return null;

  const checkoutUrl = payload['checkout_url'];
  if (typeof checkoutUrl !== 'string' || checkoutUrl.trim() === '') {
    return null;
  }

  if (payload['payment_status'] !== 'pending') {
    return null;
  }

  const stripeSessionId = payload['stripe_session_id'];
  return {
    checkoutUrl: checkoutUrl.trim(),
    stripeSessionId:
      typeof stripeSessionId === 'string' && stripeSessionId.trim() !== ''
        ? stripeSessionId.trim()
        : undefined
  };
}

export function isPlusSubscribeInstantlyCompleted(
  response: PostPlusSubscribe200 | unknown
): boolean {
  const payload = normalizeSubscribePayload(response);
  return payload?.['payment_status'] === 'completed';
}
