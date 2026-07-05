/** Storefront routes for Phase 3 personalization features — single source for discovery CTAs. */
export const PERSONALIZATION_ROUTES = {
  memory: '/shopping-memory',
  goal: '/goal-shopping',
  mood: '/mood-shopping',
  replenishment: '/replenishment-reminders',
  household: '/household-profiles',
  apps: '/apps'
} as const;

export const PERSONALIZATION_FEATURE_KEYS = [
  'memory',
  'goal',
  'mood',
  'replenishment',
  'household'
] as const;

export type DiscoveryFeatureKey = (typeof PERSONALIZATION_FEATURE_KEYS)[number];
