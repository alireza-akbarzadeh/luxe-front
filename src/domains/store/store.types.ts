import type { DtoStoreResponse } from '~/src/services/-stores-get.schemas';

export type ViewMode = 'grid' | 'compact' | 'list';
export type SortKey = 'popular' | 'top_rated' | 'most_followed' | 'recently_joined' | 'name_asc';

export type StoreBadge = 'Verified' | 'Top Rated' | 'New' | 'Free Shipping';

export interface ModelsStoreReview extends DtoStoreResponse {
  badges: StoreBadge[];
  productCount: number;
  shippingSpeedDays: number;
  freeShipping: boolean;
  trendingScore: number;
  isNew: boolean;
}
