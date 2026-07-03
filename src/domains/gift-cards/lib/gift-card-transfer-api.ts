import { customInstance } from '@/lib/api/api-client';
import type { DtoGiftCardResponse } from '@/services/-gift-cards-post.schemas';
import type { UtilsResponse } from '@/services/-wallet-deposit-post.schemas';

export type GiftRecipientLookup = {
  id: number;
  display_name: string;
  masked_email?: string;
  masked_phone?: string;
};

export type GetGiftCardRecipientLookup200 = UtilsResponse & {
  data?: GiftRecipientLookup[];
};

export type PostGiftCardTransfer200 = UtilsResponse & {
  data?: DtoGiftCardResponse;
};

/** Search Luxe members by email or phone for gift card transfer. */
export async function getGiftCardRecipientLookup(query: string) {
  return customInstance<GetGiftCardRecipientLookup200>({
    url: '/gift-cards/recipient-lookup',
    method: 'GET',
    params: { q: query }
  });
}

/** Transfer an active gift card to another Luxe member. */
export async function postGiftCardTransfer(code: string, recipientUserId: number) {
  return customInstance<PostGiftCardTransfer200>({
    url: `/gift-cards/${encodeURIComponent(code)}/transfer`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: { recipient_user_id: recipientUserId }
  });
}
