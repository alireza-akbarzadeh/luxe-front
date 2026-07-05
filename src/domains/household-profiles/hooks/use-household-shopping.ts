'use client';

import { usePostAiHouseholdShopping } from '@/services/-ai-household-shopping-post';
import type {
  DtoAiHouseholdShoppingRequest,
  DtoAiHouseholdShoppingResponse
} from '@/services/-ai-household-shopping-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Household shopping is temporarily unavailable. Browse the catalog or try again shortly.';

/**
 * Per-member catalog picks via POST /ai/household-shopping (authenticated).
 */
export function useHouseholdShopping() {
  const mutation = usePostAiHouseholdShopping();

  const findForHousehold = async (
    payload: DtoAiHouseholdShoppingRequest
  ): Promise<DtoAiHouseholdShoppingResponse | null> => {
    try {
      const response = await mutation.mutateAsync({ data: payload });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    findForHousehold,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
