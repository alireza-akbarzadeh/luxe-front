'use client';

import { usePostAiVirtualTryOn } from '@/services/-ai-virtual-try-on-post';
import type { DtoAiVirtualTryOnResponse } from '@/services/-ai-virtual-try-on-post.schemas';

/** Uploads a shopper photo and returns AI fit guidance for a PDP product. */
export function useVirtualTryOn(productId: number) {
  const mutation = usePostAiVirtualTryOn();

  const tryOn = async (
    photoBase64: string,
    options?: { sizeProfile?: string; context?: string }
  ): Promise<DtoAiVirtualTryOnResponse | null> => {
    try {
      const response = await mutation.mutateAsync({
        data: {
          product_id: productId,
          photo_base64: photoBase64,
          size_profile: options?.sizeProfile?.trim() || undefined,
          context: options?.context?.trim() || undefined
        }
      });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    tryOn,
    isPending: mutation.isPending,
    error: mutation.error
  };
}
