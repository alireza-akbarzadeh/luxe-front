'use client';

import { usePostAiChat } from '@/services/-ai-chat-post';
import type { DtoAiChatMessage } from '@/services/-ai-chat-post.schemas';

const AI_OFFLINE_REPLY =
  'Our AI assistant is temporarily unavailable. Try the Q&A tab or contact the seller.';

/**
 * Grounded product chat via POST /ai/chat.
 */
export function useProductAiChat(productId: number) {
  const mutation = usePostAiChat();

  const sendMessage = async (messages: DtoAiChatMessage[]): Promise<string> => {
    try {
      const response = await mutation.mutateAsync({
        data: { product_id: productId, messages }
      });
      return response.data?.reply?.trim() || AI_OFFLINE_REPLY;
    } catch {
      return AI_OFFLINE_REPLY;
    }
  };

  return {
    sendMessage,
    isPending: mutation.isPending
  };
}
