'use client';

import { postAiMoodShopping } from '@/services/-ai-mood-shopping-post';
import type {
  DtoAiMoodShoppingRequest,
  DtoAiMoodShoppingResponse
} from '@/services/-ai-mood-shopping-post.schemas';

const MOOD_SHOPPING_TIMEOUT_MS = 90_000;

const AI_OFFLINE_MESSAGE =
  'Mood shopping is temporarily unavailable. Try browsing collections or search instead.';

/**
 * Mood-aligned product discovery via POST /ai/mood-shopping.
 */
export function useMoodShopping() {
  const shopByMood = async (
    payload: DtoAiMoodShoppingRequest
  ): Promise<DtoAiMoodShoppingResponse | null> => {
    try {
      const response = await postAiMoodShopping(payload, { timeout: MOOD_SHOPPING_TIMEOUT_MS });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    shopByMood,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
