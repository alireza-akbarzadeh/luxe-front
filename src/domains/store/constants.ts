import type { SortKey } from '@/domains/store/store.types';

export const PAGE_SIZE = 24;

export const STORE_BANNER_FALLBACK =
  'https://images.unsplash.com/photo-1441984904996-e0b495a6de39?w=1600&h=600&fit=crop';

export const STORE_LOGO_FALLBACK =
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop';

/** Hero stats shown on the stores listing page */
export const STORE_HERO_STATS = [
  { label: 'Verified brands', value: '120+' },
  { label: 'Independent makers', value: '850+' },
  { label: 'Avg. store rating', value: '4.8' },
  { label: 'Countries represented', value: '32' }
] as const;

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'most_followed', label: 'Most Followed' },
  { value: 'recently_joined', label: 'Recently Joined' },
  { value: 'name_asc', label: 'Name (A–Z)' }
];
export const SHIPPING_SPEED_OPTIONS = [
  { value: 'any', label: 'Any speed' },
  { value: '1', label: 'Next-day' },
  { value: '3', label: 'Within 3 days' },
  { value: '7', label: 'Within a week' }
];
export const RATING_OPTIONS = [4.5, 4, 3.5, 3];
export const STORE_SIZE_OPTIONS = [
  { value: 'any', label: 'Any size' },
  { value: 'boutique', label: 'Boutique (<50 products)' },
  { value: 'mid', label: 'Mid (50–500)' },
  { value: 'large', label: 'Large (500+)' }
];
export const TRENDING_CATEGORIES = [
  'Fashion',
  'Sneakers',
  'Watches',
  'Beauty',
  'Home',
  'Tech',
  'Jewelry',
  'Art'
];

export const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Rating', value: 'rating' }
];
