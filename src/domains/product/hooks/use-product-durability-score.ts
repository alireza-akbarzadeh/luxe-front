'use client';

import { usePostAiDurabilityScore } from '@/services/-ai-durability-score-post';
import type { DtoAiDurabilityScoreResponse } from '@/services/-ai-durability-score-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Durability score is temporarily unavailable. Check specifications and reviews before you buy.';

/**
 * AI durability / longevity score for a PDP via POST /ai/durability-score.
 */
export function useProductDurabilityScore(productId: number) {
  const mutation = usePostAiDurabilityScore();

  const fetchDurabilityScore = async (): Promise<DtoAiDurabilityScoreResponse | null> => {
    if (productId <= 0) {
      return null;
    }
    const response = await mutation.mutateAsync({
      data: { product_id: productId }
    });
    return response.data ?? null;
  };

  return {
    fetchDurabilityScore,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
