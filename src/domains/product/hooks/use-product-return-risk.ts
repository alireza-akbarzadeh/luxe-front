'use client';

import { usePostAiReturnRisk } from '@/services/-ai-return-risk-post';
import type { DtoAiReturnRiskResponse } from '@/services/-ai-return-risk-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Return risk insights are temporarily unavailable. Check the store return policy before you buy.';

/**
 * AI return-risk guidance for a PDP via POST /ai/return-risk.
 */
export function useProductReturnRisk(productId: number) {
  const mutation = usePostAiReturnRisk();

  const fetchReturnRisk = async (): Promise<DtoAiReturnRiskResponse | null> => {
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
    fetchReturnRisk,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
