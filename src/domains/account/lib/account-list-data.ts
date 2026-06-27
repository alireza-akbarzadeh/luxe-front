import type { DtoGiftCardResponse } from '@/services/-gift-cards-post.schemas';
import type { DtoProductQuestionResponse } from '@/services/-products-{id}-questions-get.schemas';
import type { DtoReviewResponse } from '@/services/-reviews-post.schemas';

export type UserReviewItem = DtoReviewResponse & {
  product_name?: string;
  product_slug?: string;
};

export type PaginatedReviewsData = {
  reviews?: UserReviewItem[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type PaginatedQuestionsData = {
  questions?: DtoProductQuestionResponse[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type PaginatedGiftCardsData = {
  gift_cards?: DtoGiftCardResponse[];
  total?: number;
  limit?: number;
  offset?: number;
};

/** Extracts typed list payload from Orval responses that use generic UtilsResponse.data. */
export function readPaginatedData<T>(response: unknown): T | undefined {
  if (!response || typeof response !== 'object') return undefined;
  return (response as { data?: T }).data;
}
