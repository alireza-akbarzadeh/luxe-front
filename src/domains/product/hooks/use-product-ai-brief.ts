'use client';

import { usePostAiProductBrief } from '@/services/-ai-product-brief-post';
import type { DtoAiProductBriefResponse } from '@/services/-ai-product-brief-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Our AI assistant is temporarily unavailable. Try the Q&A tab or contact the seller.';

/**
 * Structured 30-second product brief via POST /ai/product-brief.
 */
export function useProductAiBrief(productId: number) {
  const mutation = usePostAiProductBrief();

  const fetchBrief = async (): Promise<DtoAiProductBriefResponse | null> => {
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
    fetchBrief,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
