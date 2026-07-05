'use client';

import { usePostAiWishlistIntelligence } from '@/services/-ai-wishlist-intelligence-post';
import type { DtoAiWishlistIntelligenceResponse } from '@/services/-ai-wishlist-intelligence-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Wishlist insights are temporarily unavailable. Review prices and stock on each saved item.';

/**
 * AI prioritization for the authenticated wishlist via POST /ai/wishlist-intelligence.
 */
export function useWishlistIntelligence() {
  const mutation = usePostAiWishlistIntelligence();

  const fetchWishlistIntelligence = async (
    limit?: number
  ): Promise<DtoAiWishlistIntelligenceResponse | null> => {
    try {
      const response = await mutation.mutateAsync({
        data: limit ? { limit } : {}
      });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    fetchWishlistIntelligence,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
