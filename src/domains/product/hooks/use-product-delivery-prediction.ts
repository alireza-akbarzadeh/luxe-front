'use client';

import { usePostAiDeliveryPrediction } from '@/services/-ai-delivery-prediction-post';
import type { DtoAiDeliveryPredictionResponse } from '@/services/-ai-delivery-prediction-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Delivery estimates are temporarily unavailable. Check shipping options at checkout.';

/** AI delivery window estimate for a PDP via POST /ai/delivery-prediction. */
export function useProductDeliveryPrediction(productId: number) {
  const mutation = usePostAiDeliveryPrediction();

  const fetchDeliveryPrediction = async (): Promise<DtoAiDeliveryPredictionResponse | null> => {
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
    fetchDeliveryPrediction,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
