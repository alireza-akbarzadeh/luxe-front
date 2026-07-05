'use client';

import { usePostAiOutfitBuilder } from '@/services/-ai-outfit-builder-post';
import type { DtoAiOutfitBuilderResponse } from '@/services/-ai-outfit-builder-post.schemas';

/** Loads AI outfit plan anchored on a PDP product. */
export function useOutfitBuilder(productId: number) {
  const mutation = usePostAiOutfitBuilder();

  const buildOutfit = async (
    occasion: string,
    context?: string,
    budgetMax?: number
  ): Promise<DtoAiOutfitBuilderResponse | null> => {
    try {
      const response = await mutation.mutateAsync({
        data: {
          product_id: productId,
          occasion: occasion.trim() || undefined,
          context: context?.trim() || undefined,
          budget_max: budgetMax && budgetMax > 0 ? budgetMax : undefined
        }
      });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    buildOutfit,
    isPending: mutation.isPending,
    error: mutation.error
  };
}
