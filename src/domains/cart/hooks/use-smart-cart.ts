'use client';

import { postAiSmartCart } from '@/services/-ai-smart-cart-post';
import type {
  DtoAiSmartCartRequest,
  DtoAiSmartCartResponse
} from '@/services/-ai-smart-cart-post.schemas';

const SMART_CART_TIMEOUT_MS = 90_000;

const AI_OFFLINE_MESSAGE =
  'Smart cart insights are temporarily unavailable. Review items manually before checkout.';

/**
 * AI checkout guidance for cart contents via POST /ai/smart-cart.
 */
export function useSmartCart() {
  const analyzeCart = async (
    payload: DtoAiSmartCartRequest
  ): Promise<DtoAiSmartCartResponse | null> => {
    try {
      const response = await postAiSmartCart(payload, { timeout: SMART_CART_TIMEOUT_MS });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    analyzeCart,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
