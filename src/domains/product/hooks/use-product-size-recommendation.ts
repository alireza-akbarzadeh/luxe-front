'use client';

import { usePostAiSizeRecommendation } from '@/services/-ai-size-recommendation-post';
import type {
  DtoAiSizeRecommendationResponse,
  DtoAiSizeShopperProfile
} from '@/services/-ai-size-recommendation-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Size guidance is temporarily unavailable. Use the size chart and reviews to choose a fit.';

/**
 * AI size pick for sized PDP listings via POST /ai/size-recommendation.
 */
export function useProductSizeRecommendation(productId: number) {
  const mutation = usePostAiSizeRecommendation();

  const fetchSizeRecommendation = async (
    profile?: DtoAiSizeShopperProfile
  ): Promise<DtoAiSizeRecommendationResponse | null> => {
    if (productId <= 0) {
      return null;
    }
    try {
      const response = await mutation.mutateAsync({
        data: {
          product_id: productId,
          profile
        }
      });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    fetchSizeRecommendation,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
