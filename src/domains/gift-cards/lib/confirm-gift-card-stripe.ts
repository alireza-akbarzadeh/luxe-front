import { customInstance } from '@/lib/api/api-client';
import type { DtoGiftCardResponse } from '@/services/-gift-cards-post.schemas';
import type { UtilsResponse } from '@/services/-wallet-deposit-post.schemas';

export type PostGiftCardsConfirmStripe200 = UtilsResponse & {
  data?: DtoGiftCardResponse;
};

/** Confirms gift card purchase after Stripe redirect (idempotent; also works if webhook already ran). */
export async function postGiftCardsConfirmStripe(sessionId: string) {
  return customInstance<PostGiftCardsConfirmStripe200>({
    url: '/gift-cards/confirm-stripe',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: { session_id: sessionId }
  });
}
