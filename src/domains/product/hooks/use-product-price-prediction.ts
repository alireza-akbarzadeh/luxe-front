'use client';

import { usePostAiPricePrediction } from '@/services/-ai-price-prediction-post';
import type { DtoAiPricePredictionResponse } from '@/services/-ai-price-prediction-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Price prediction is temporarily unavailable. Use the chart and compare prices before you buy.';

/**
 * AI short-term price forecast for a PDP via POST /ai/price-prediction.
 */
export function useProductPricePrediction(productId: number) {
  const mutation = usePostAiPricePrediction();

  const fetchPricePrediction = async (): Promise<DtoAiPricePredictionResponse | null> => {
    if (productId <= 0) {
      return null;
    }
    try {
      const response = await mutation.mutateAsync({
        data: { product_id: productId, days: 90 }
      });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    fetchPricePrediction,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
