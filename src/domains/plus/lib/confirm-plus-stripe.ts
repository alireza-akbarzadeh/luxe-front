import { customInstance } from '@/lib/api/api-client';
import type { DtoMembershipStatusResponse } from '@/services/-plus-membership-get.schemas';
import type { UtilsResponse } from '@/services/-plus-subscribe-post.schemas';

/** Receipt returned after confirming a Stripe Plus checkout session. */
export type PlusPaymentReceipt = {
  payment_method?: string;
  amount?: number;
  currency?: string;
  paid_at?: string;
  stripe_session_id?: string;
  status?: string;
  plan_name?: string;
};

export type ConfirmPlusStripeResponse = {
  membership?: DtoMembershipStatusResponse;
  receipt?: PlusPaymentReceipt;
};

export type PostPlusSubscribeConfirmStripe200 = UtilsResponse & {
  data?: ConfirmPlusStripeResponse;
};

/** Confirms Luxe Plus after Stripe redirect (idempotent; also works if webhook already ran). */
export async function postPlusSubscribeConfirmStripe(sessionId: string) {
  return customInstance<PostPlusSubscribeConfirmStripe200>({
    url: '/plus/subscribe/confirm-stripe',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: { session_id: sessionId }
  });
}
