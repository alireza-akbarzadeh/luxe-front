'use client';

import { usePostAiRoomPreview } from '@/services/-ai-room-preview-post';
import type { DtoAiRoomPreviewResponse } from '@/services/-ai-room-preview-post.schemas';

/** Uploads a room photo and returns AI placement guidance for a PDP product. */
export function useRoomPreview(productId: number) {
  const mutation = usePostAiRoomPreview();

  const previewRoom = async (
    roomImageBase64: string,
    context?: string
  ): Promise<DtoAiRoomPreviewResponse | null> => {
    try {
      const response = await mutation.mutateAsync({
        data: {
          product_id: productId,
          room_image_base64: roomImageBase64,
          context: context?.trim() || undefined
        }
      });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    previewRoom,
    isPending: mutation.isPending,
    error: mutation.error
  };
}
