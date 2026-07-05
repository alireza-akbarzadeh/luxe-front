'use client';

import { usePostAiProductConfigurator } from '@/services/-ai-product-configurator-post';
import type { DtoAiProductConfiguratorResponse } from '@/services/-ai-product-configurator-post.schemas';

/** Loads AI-guided variant recommendations for a product listing. */
export function useProductConfigurator(productId: number) {
  const mutation = usePostAiProductConfigurator();

  const configure = async (
    context: string,
    preferences?: Record<string, string>
  ): Promise<DtoAiProductConfiguratorResponse | null> => {
    try {
      const response = await mutation.mutateAsync({
        data: {
          product_id: productId,
          context: context.trim() || undefined,
          preferences: preferences && Object.keys(preferences).length > 0 ? preferences : undefined
        }
      });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    configure,
    isPending: mutation.isPending,
    error: mutation.error
  };
}
