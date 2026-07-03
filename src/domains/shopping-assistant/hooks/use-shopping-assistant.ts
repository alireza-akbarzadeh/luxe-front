'use client';

import { usePostAiShoppingAssistant } from '@/services/-ai-shopping-assistant-post';
import type {
  DtoAiChatMessage,
  DtoAiShoppingAssistantResponse
} from '@/services/-ai-shopping-assistant-post.schemas';

const AI_OFFLINE_REPLY =
  'Our shopping assistant is temporarily unavailable. Try search or browse the catalog.';

/**
 * Store-wide conversational shopping via POST /ai/shopping-assistant.
 */
export function useShoppingAssistant() {
  const mutation = usePostAiShoppingAssistant();

  const sendTurn = async (
    messages: DtoAiChatMessage[]
  ): Promise<DtoAiShoppingAssistantResponse | null> => {
    try {
      const response = await mutation.mutateAsync({ data: { messages } });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    sendTurn,
    isPending: mutation.isPending,
    offlineReply: AI_OFFLINE_REPLY
  };
}
