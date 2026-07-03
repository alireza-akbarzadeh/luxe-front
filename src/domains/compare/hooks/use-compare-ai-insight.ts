'use client';

import { usePostAiCompareInsight } from '@/services/-ai-compare-insight-post';
import type { DtoAiCompareInsightResponse } from '@/services/-ai-compare-insight-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Our AI comparison assistant is temporarily unavailable. Use the spec table below to decide.';

/**
 * AI-powered comparison insight for 2–4 products via POST /ai/compare-insight.
 */
export function useCompareAiInsight(productIds: number[]) {
  const mutation = usePostAiCompareInsight();
  const sortedKey = [...productIds].sort((a, b) => a - b).join(',');

  const fetchInsight = async (): Promise<DtoAiCompareInsightResponse | null> => {
    if (productIds.length < 2) {
      return null;
    }
    try {
      const response = await mutation.mutateAsync({
        data: { product_ids: productIds }
      });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    fetchInsight,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE,
    cacheKey: sortedKey
  };
}
