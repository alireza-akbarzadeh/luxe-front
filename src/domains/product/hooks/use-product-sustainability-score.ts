'use client';

import { usePostAiSustainabilityScore } from '@/services/-ai-sustainability-score-post';
import type { DtoAiSustainabilityScoreResponse } from '@/services/-ai-sustainability-score-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Sustainability score is temporarily unavailable. Check materials and certifications on the listing.';

/**
 * AI sustainability / ethics score for a PDP via POST /ai/sustainability-score.
 */
export function useProductSustainabilityScore(productId: number) {
  const mutation = usePostAiSustainabilityScore();

  const fetchSustainabilityScore = async (): Promise<DtoAiSustainabilityScoreResponse | null> => {
    if (productId <= 0) {
      return null;
    }
    try {
      const response = await mutation.mutateAsync({
        data: { product_id: productId }
      });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    fetchSustainabilityScore,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
