export const HOME_STATS = [
  { key: 'customers', value: 50_000, suffix: '+' },
  { key: 'products', value: 2_400, suffix: '+' },
  { key: 'brands', value: 120, suffix: '+' },
  { key: 'countries', value: 45, suffix: '' }
] as const;

export const HOME_PLATFORM_STATS = [
  { key: 'shoppers', value: 50000, suffix: '+' },
  { key: 'products', value: 2400, suffix: '+' },
  { key: 'brands', value: 120, suffix: '+' },
  { key: 'rating', value: 4.9, suffix: '★', decimals: 1 },
  { key: 'countries', value: 45, suffix: '' },
  { key: 'successRate', value: 99.9, suffix: '%', decimals: 1 }
] as const;

export const HOME_HOW_IT_WORKS = [
  { step: '01', key: 'discover' },
  { step: '02', key: 'choose' },
  { step: '03', key: 'checkout' },
  { step: '04', key: 'enjoy' }
] as const;

export const MARKETPLACE_BENEFIT_KEYS = ['curated', 'stores', 'editorial', 'checkout'] as const;

export const MARKETPLACE_TILE_KEYS = ['stores', 'collections', 'reviews', 'checkout'] as const;

export const FEATURE_ITEMS = [
  { id: 1, key: 'shipping', icon: 'truck' },
  { id: 2, key: 'quality', icon: 'gem' },
  { id: 3, key: 'warranty', icon: 'shield' },
  { id: 4, key: 'support', icon: 'headphones' }
] as const;

export const HERO_TRUST_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'
] as const;

export const TRUST_ITEMS = [
  { key: 'freeShipping', icon: 'truck' },
  { key: 'easyReturns', icon: 'return' },
  { key: 'secureCheckout', icon: 'lock' },
  { key: 'support', icon: 'headphones' }
] as const;

export const CATEGORY_IMAGES = {
  accessories: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=900&h=1100&fit=crop',
  watches: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=1100&fit=crop',
  eyewear: 'https://images.unsplash.com/photo-1572635196233-14b40f21bd47?w=900&h=1100&fit=crop',
  electronics: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=900&h=1100&fit=crop',
  home: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&h=1100&fit=crop',
  lifestyle: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&h=1100&fit=crop',
  fashion: 'https://images.unsplash.com/photo-1483985988355-763728e6155d?w=900&h=1100&fit=crop',
  default: 'https://images.unsplash.com/photo-1441984904996-e0b495a6de39?w=900&h=1100&fit=crop'
} as const;

export const FALLBACK_CATEGORY_IMAGES = [
  CATEGORY_IMAGES.accessories,
  CATEGORY_IMAGES.home,
  CATEGORY_IMAGES.electronics,
  CATEGORY_IMAGES.lifestyle,
  CATEGORY_IMAGES.fashion,
  CATEGORY_IMAGES.watches
] as const;

export type Testimonial = {
  id: number;
  key: string;
  avatar: string;
  rating: number;
  name: string;
  role: string;
  content: string;
};

export const TESTIMONIAL_ITEMS = [
  {
    id: 2,
    key: '2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    rating: 5
  },
  {
    id: 3,
    key: '3',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    rating: 5
  },
  {
    id: 4,
    key: '3',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    rating: 5
  },
  {
    id: 5,
    key: '3',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    rating: 5
  },
  {
    id: 6,
    key: '3',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    rating: 5
  }
] as const;
