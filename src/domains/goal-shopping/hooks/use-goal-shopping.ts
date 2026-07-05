'use client';

import { postAiGoalShopping } from '@/services/-ai-goal-shopping-post';
import type {
  DtoAiGoalShoppingRequest,
  DtoAiGoalShoppingResponse
} from '@/services/-ai-goal-shopping-post.schemas';

const GOAL_SHOPPING_TIMEOUT_MS = 90_000;

const AI_OFFLINE_MESSAGE =
  'Goal shopping is temporarily unavailable. Try browsing the catalog or use search.';

/**
 * Goal-based product discovery via POST /ai/goal-shopping.
 */
export function useGoalShopping() {
  const findForGoal = async (
    payload: DtoAiGoalShoppingRequest
  ): Promise<DtoAiGoalShoppingResponse | null> => {
    try {
      const response = await postAiGoalShopping(payload, { timeout: GOAL_SHOPPING_TIMEOUT_MS });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    findForGoal,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
