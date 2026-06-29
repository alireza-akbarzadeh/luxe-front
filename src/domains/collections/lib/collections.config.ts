import type { DtoCollectionResponse } from '~/src/services/-collections-get.schemas';

/** Curated shop collections — links map to `/shop` URL filters. */

export const CURATED_COLLECTIONS: DtoCollectionResponse[] = [
  {
    id: 1,
    eyebrow: 'Spring edit',
    title: 'Modern Essentials',
    description: 'Refined staples built for everyday luxury — limited seasonal palette.',
    href: '/shop?sortBy=newest&showOnlyNew=true',
    image_url:
      'https://images.unsplash.com/photo-1483985988355-763728e6155d?w=1200&h=1400&fit=crop',
    cta_label: 'Shop the edit',
    status: 'active',
    slug: 'modern-essentials',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    preview_sort: 'newest',
    sort_order: 1,
    workflow_state: {
      id: 1,
      name: 'published'
    }
  },
  {
    id: 2,
    eyebrow: 'Crafted to last',
    title: 'The Atelier Collection',
    description: 'Hand-finished pieces from independent makers worldwide.',
    href: '/shop?sortBy=rating',
    image_url:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=1400&fit=crop',
    cta_label: 'Explore collection',
    status: 'active',
    slug: 'the-atelier-collection',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    preview_sort: 'rating_desc',
    sort_order: 1,
    workflow_state: {
      id: 1,
      name: 'published'
    }
  },
  {
    id: 3,
    eyebrow: 'Limited time',
    title: 'Archive Sale',
    description: 'Past-season favorites at exceptional value while sizes last.',
    href: '/shop?showOnlySale=true',
    image_url:
      'https://images.unsplash.com/photo-1441984904996-e0b495a6de39?w=1200&h=1400&fit=crop',
    cta_label: 'Shop sale',
    status: 'active',
    slug: 'archive-sale',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    preview_sort: 'price_asc',
    sort_order: 1,
    workflow_state: {
      id: 1,
      name: 'published'
    }
  },
  {
    id: 4,
    eyebrow: 'Most loved',
    title: 'Trending Now',
    description: 'What shoppers are adding to cart this week across the marketplace.',
    href: '/shop?sortBy=trending',
    image_url:
      'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=1400&fit=crop',
    cta_label: 'See trending',
    status: 'active',
    slug: 'trending-now',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    preview_sort: 'reviews_desc',
    sort_order: 1,
    workflow_state: {
      id: 1,
      name: 'published'
    }
  }
];
