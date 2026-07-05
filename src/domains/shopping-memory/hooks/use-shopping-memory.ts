'use client';

import { usePostAiShoppingMemory } from '@/services/-ai-shopping-memory-post';
import type { DtoAiShoppingMemoryResponse } from '@/services/-ai-shopping-memory-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Shopping memory is temporarily unavailable. Browse products to build your taste profile.';

/**
 * Personalized style summary via POST /ai/shopping-memory (authenticated).
 */
export function useShoppingMemory() {
  const mutation = usePostAiShoppingMemory();

  const fetchShoppingMemory = async (): Promise<DtoAiShoppingMemoryResponse | null> => {
    try {
      const response = await mutation.mutateAsync({ data: {} });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    fetchShoppingMemory,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
