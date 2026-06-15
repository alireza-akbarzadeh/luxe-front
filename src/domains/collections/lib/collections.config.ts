import type { GetProductsSort } from '@/services/-products-get.schemas';

/** Curated shop collections — links map to `/shop` URL filters. */
export interface CuratedCollection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  image: string;
  cta: string;
  /** Optional product preview query for the collections page grid. */
  previewParams?: {
    sort?: GetProductsSort;
    is_new?: boolean;
    category_id?: number;
  };
}

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'essentials',
    eyebrow: 'Spring edit',
    title: 'Modern Essentials',
    description: 'Refined staples built for everyday luxury — limited seasonal palette.',
    href: '/shop?sortBy=newest&showOnlyNew=true',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e6155d?w=1200&h=1400&fit=crop',
    cta: 'Shop the edit',
    previewParams: { sort: 'newest', is_new: true }
  },
  {
    id: 'atelier',
    eyebrow: 'Crafted to last',
    title: 'The Atelier Collection',
    description: 'Hand-finished pieces from independent makers worldwide.',
    href: '/shop?sortBy=rating',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=1400&fit=crop',
    cta: 'Explore collection',
    previewParams: { sort: 'rating_desc' }
  },
  {
    id: 'sale',
    eyebrow: 'Limited time',
    title: 'Archive Sale',
    description: 'Past-season favorites at exceptional value while sizes last.',
    href: '/shop?showOnlySale=true',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b495a6de39?w=1200&h=1400&fit=crop',
    cta: 'Shop sale',
    previewParams: { sort: 'price_asc' }
  },
  {
    id: 'trending',
    eyebrow: 'Most loved',
    title: 'Trending Now',
    description: 'What shoppers are adding to cart this week across the marketplace.',
    href: '/shop?sortBy=trending',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=1400&fit=crop',
    cta: 'See trending',
    previewParams: { sort: 'reviews_desc' }
  }
];
