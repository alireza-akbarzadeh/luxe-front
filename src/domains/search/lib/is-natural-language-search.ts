const INTENT_PHRASES =
  /\b(for|under|over|less than|more than|budget|gift|looking for|need|want|similar|cheaper|waterproof|minimalist|birthday|occasion|daily|comfortable)\b/i;

/**
 * Heuristic: skip AI intent parsing for short keyword-style queries.
 */
export function isNaturalLanguageSearchQuery(query: string): boolean {
  const trimmed = query.trim();
  if (trimmed.length < 12) {
    return false;
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 3) {
    return false;
  }

  if (INTENT_PHRASES.test(trimmed)) {
    return true;
  }

  return words.length >= 5;
}
