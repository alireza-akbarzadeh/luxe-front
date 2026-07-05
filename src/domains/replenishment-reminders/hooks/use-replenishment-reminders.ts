'use client';

import { usePostAiReplenishmentReminders } from '@/services/-ai-replenishment-reminders-post';
import type { DtoAiReplenishmentRemindersResponse } from '@/services/-ai-replenishment-reminders-post.schemas';

const AI_OFFLINE_MESSAGE =
  'Replenishment reminders are temporarily unavailable. Check your order history and saved items.';

/**
 * AI reorder suggestions from purchase history via POST /ai/replenishment-reminders.
 */
export function useReplenishmentReminders() {
  const mutation = usePostAiReplenishmentReminders();

  const fetchReminders = async (): Promise<DtoAiReplenishmentRemindersResponse | null> => {
    try {
      const response = await mutation.mutateAsync({ data: {} });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    fetchReminders,
    isPending: mutation.isPending,
    offlineMessage: AI_OFFLINE_MESSAGE
  };
}
