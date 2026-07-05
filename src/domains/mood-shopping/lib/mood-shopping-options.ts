/** Mood keys for AI mood shopping — labels come from i18n `moodShopping.moods.*`. */
export const MOOD_SHOPPING_KEYS = [
  'cozy',
  'bold',
  'minimal',
  'romantic',
  'professional',
  'playful',
  'luxurious',
  'calm'
] as const;

export type MoodShoppingKey = (typeof MOOD_SHOPPING_KEYS)[number];

export function isMoodShoppingKey(value: string): value is MoodShoppingKey {
  return (MOOD_SHOPPING_KEYS as readonly string[]).includes(value);
}
