'use client';

import { postAiSearchIntent } from '@/services/-ai-search-intent-post';
import type { DtoAiSearchIntentResponse } from '@/services/-ai-search-intent-post.schemas';

/**
 * Parses natural-language search via POST /ai/search-intent.
 * Returns null on failure so callers can fall back to keyword search.
 */
export async function parseSearchIntent(query: string): Promise<DtoAiSearchIntentResponse | null> {
  try {
    const response = await postAiSearchIntent({ query: query.trim() });
    return response.data ?? null;
  } catch {
    return null;
  }
}
