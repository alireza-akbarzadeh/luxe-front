'use client';

import { usePostAiVisualSearch } from '@/services/-ai-visual-search-post';
import type { DtoAiVisualSearchResponse } from '@/services/-ai-visual-search-post.schemas';

/** Uploads a product photo for AI visual similarity search. */
export function useVisualSearch() {
  const mutation = usePostAiVisualSearch();

  const searchByImage = async (imageBase64: string): Promise<DtoAiVisualSearchResponse | null> => {
    try {
      const response = await mutation.mutateAsync({ data: { image_base64: imageBase64 } });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    searchByImage,
    isPending: mutation.isPending,
    error: mutation.error
  };
}
