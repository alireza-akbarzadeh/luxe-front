'use client';

import { usePostAiTrustScore } from '@/services/-ai-trust-score-post';
import type { DtoAiTrustScoreResponse } from '@/services/-ai-trust-score-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Trust score is temporarily unavailable. Check reviews and seller details before you buy.';

/**
 * AI composite trust score for a PDP via POST /ai/trust-score.
 */
export function useProductTrustScore(productId: number) {
  const mutation = usePostAiTrustScore();

  const fetchTrustScore = async (): Promise<DtoAiTrustScoreResponse | null> => {
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
    fetchTrustScore,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
