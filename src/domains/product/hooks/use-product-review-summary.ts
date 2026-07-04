'use client';

import { usePostAiReviewSummary } from '@/services/-ai-review-summary-post';
import type { DtoAiReviewSummaryResponse } from '@/services/-ai-review-summary-post.schemas';

/** Minimum approved reviews required before the AI summary endpoint accepts a request. */
export const MIN_REVIEWS_FOR_AI_SUMMARY = 3;

/**
 * AI synthesis of buyer reviews for a PDP via POST /ai/review-summary.
 */
export function useProductReviewSummary(productId: number) {
  const mutation = usePostAiReviewSummary();

  const fetchSummary = async (): Promise<DtoAiReviewSummaryResponse | null> => {
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
    fetchSummary,
    isPending: mutation.isPending
  };
}
