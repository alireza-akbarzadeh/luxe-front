import type { DtoCollectionResponse } from '@/services/-collections-get.schemas';

/** Offline fallback when lifestyle collections API is empty. */
export const LIFESTYLE_COLLECTIONS_FALLBACK: DtoCollectionResponse[] = [
  {
    id: 101,
    slug: 'minimal-workspace',
    eyebrow: 'Lifestyle',
    title: 'Minimal Workspace',
    description:
      'Clean lines, quiet materials, and pieces that keep your desk calm — watches, organizers, and lighting that earn their place.',
    href: '/shop?search=watch',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
    cta_label: 'Shop the edit',
    sort_order: 10,
    status: 'active',
    theme: 'lifestyle',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    preview_sort: '',
  },
  {
    id: 102,
    slug: 'travel-essentials',
    eyebrow: 'Lifestyle',
    title: 'Travel Essentials',
    description:
      'Compact carry, durable finishes, and timeless accessories built for terminals, hotels, and time zones.',
    href: '/shop?search=leather',
    image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200',
    cta_label: 'Pack smarter',
    sort_order: 11,
    status: 'active',
    theme: 'lifestyle',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    preview_sort: '',
  },
  {
    id: 103,
    slug: 'first-apartment',
    eyebrow: 'Lifestyle',
    title: 'First Apartment',
    description:
      'Foundational pieces for a first place of your own — elevated everyday objects that make a small space feel intentional.',
    href: '/shop',
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d4046?w=1200',
    cta_label: 'Start here',
    sort_order: 12,
    status: 'active',
    theme: 'lifestyle',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    preview_sort: '',
  },
];
