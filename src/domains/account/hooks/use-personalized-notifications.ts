'use client';

import { usePostAiPersonalizedNotifications } from '@/services/-ai-personalized-notifications-post';
import type { DtoAiPersonalizedNotificationsResponse } from '@/services/-ai-personalized-notifications-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Personalized alert suggestions are temporarily unavailable. You can still enable push notifications below.';

/**
 * AI-suggested notification preferences via POST /ai/personalized-notifications.
 */
export function usePersonalizedNotifications() {
  const mutation = usePostAiPersonalizedNotifications();

  const fetchSuggestions = async (): Promise<DtoAiPersonalizedNotificationsResponse | null> => {
    try {
      const response = await mutation.mutateAsync({ data: {} });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    fetchSuggestions,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
