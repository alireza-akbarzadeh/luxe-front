'use client';

import { usePostAiInteractiveViewer } from '@/services/-ai-interactive-viewer-post';
import type { DtoAiInteractiveViewerResponse } from '@/services/-ai-interactive-viewer-post.schemas';

/** Loads AI hotspot map for a product gallery image. */
export function useInteractiveViewer(productId: number) {
  const mutation = usePostAiInteractiveViewer();

  const loadViewer = async (imageIndex = 0): Promise<DtoAiInteractiveViewerResponse | null> => {
    try {
      const response = await mutation.mutateAsync({
        data: { product_id: productId, image_index: imageIndex }
      });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    loadViewer,
    isPending: mutation.isPending,
    error: mutation.error
  };
}
