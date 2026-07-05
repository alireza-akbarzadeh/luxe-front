'use client';

import { usePostAiPurchaseAdvisor } from '@/services/-ai-purchase-advisor-post';
import type { DtoAiPurchaseAdvisorResponse } from '@/services/-ai-purchase-advisor-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Purchase guidance is temporarily unavailable. Review product details and policies before you buy.';

/**
 * AI buy/wait/consider recommendation for a PDP via POST /ai/purchase-advisor.
 */
export function useProductPurchaseAdvisor(productId: number) {
  const mutation = usePostAiPurchaseAdvisor();

  const fetchPurchaseAdvisor = async (): Promise<DtoAiPurchaseAdvisorResponse | null> => {
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
    fetchPurchaseAdvisor,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
