'use client';

import { useTranslations } from 'next-intl';

import { postAiGiftFinder } from '@/services/-ai-gift-finder-post';
import type {
  DtoAiGiftFinderRequest,
  DtoAiGiftFinderResponse
} from '@/services/-ai-gift-finder-post.schemas';

/** Gift finder can run two AI passes — allow extra time before axios times out. */
const GIFT_FINDER_TIMEOUT_MS = 90_000;

/**
 * Structured gift recommendations via POST /ai/gift-finder.
 */
export function useGiftFinder() {
  const t = useTranslations('giftFinder.errors');

  const findGifts = async (
    payload: DtoAiGiftFinderRequest
  ): Promise<DtoAiGiftFinderResponse | null> => {
    try {
      const response = await postAiGiftFinder(payload, { timeout: GIFT_FINDER_TIMEOUT_MS });
      return response.data ?? null;
    } catch {
      return null;
    }
  };

  return {
    findGifts,
    offlineReply: t('unavailable')
  };
}
