import type { DtoStoreResponse } from '@/services/-stores-get.schemas';
import type { Variants } from 'framer-motion';
import type { ModelsStoreReview, StoreBadge } from '@/domains/store/store.types';

/**
 * Enrich raw API Store with UI-only computed fields.
 * NOTE: productCount / shippingSpeedDays / freeShipping / trendingScore
 * are derived (mock) — replace with real backend fields when available.
 */

export function mapStoreToView(store: DtoStoreResponse): ModelsStoreReview {
  const seed = store.id || 0;
  const productCount = 30 + ((seed * 37) % 950);
  const shippingSpeedDays = 1 + (seed % 7);
  const freeShipping = seed % 3 === 0;
  const daysOld = Math.max(
    1,
    Math.floor((Date.now() - new Date(store.joined_at as string).getTime()) / 86_400_000)
  );
  const isNew = daysOld < 60;
  const trendingScore = ((store?.follower_count ?? 0) * (store.rating || 1)) / daysOld;

  const badges: StoreBadge[] = []; // explicitly typed as badge array
  if (store.is_verified) badges.push('Verified');
  if (Number(store?.rating) >= 4.7) badges.push('Top Rated');
  if (isNew) badges.push('New');
  if (freeShipping) badges.push('Free Shipping');

  return {
    ...store,
    badges,
    productCount,
    shippingSpeedDays,
    freeShipping,
    trendingScore,
    isNew
  };
}

export const mapStoresToView = (stores: DtoStoreResponse[]) => stores.map(mapStoreToView);

export const formatCount = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};
export const formatRating = (n: number): string => n.toFixed(1);

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } }
};
export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: { y: -4, scale: 1.01, transition: { duration: 0.25, ease: 'easeOut' } }
} as const;
