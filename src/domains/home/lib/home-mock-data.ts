import type { GetProducts200DataProductsItem } from '~/src/services/-products-get.schemas';
import type { ModelsCategory } from '~/src/services/-categories-get.schemas';

export const HOME_STATS = [
  { label: 'Happy customers', value: '50K+' },
  { label: 'Curated products', value: '2,400+' },
  { label: 'Designer brands', value: '120+' },
  { label: 'Countries shipped', value: '45' }
] as const;

export const TRUST_ITEMS = [
  { title: 'Free shipping', description: 'On orders over $100', icon: 'truck' },
  { title: 'Easy returns', description: '30-day hassle-free', icon: 'return' },
  { title: 'Secure checkout', description: '256-bit encryption', icon: 'lock' },
  { title: '24/7 support', description: 'Real humans, fast help', icon: 'headphones' }
] as const;

export const BRAND_NAMES = [
  'Maison',
  'Atelier',
  'Nordic',
  'Forme',
  'Lumière',
  'Craft & Co',
  'Studio 9',
  'Velvet'
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

export const MOCK_CATEGORIES: ModelsCategory[] = [
  {
    id: 1,
    name: 'Accessories',
    slug: 'accessories',
    description: 'Elevate every outfit',
    is_active: true
  },
  {
    id: 2,
    name: 'Home & Living',
    slug: 'home',
    description: 'Design your sanctuary',
    is_active: true
  },
  {
    id: 3,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Premium tech essentials',
    is_active: true
  },
  {
    id: 4,
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Curated for modern living',
    is_active: true
  }
];

export const COLLECTION_BANNERS = [
  {
    id: 'essentials',
    eyebrow: 'Spring edit',
    title: 'Modern Essentials',
    description: 'Refined staples built for everyday luxury — limited seasonal palette.',
    href: '/shop?sortBy=newest',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e6155d?w=1200&h=1400&fit=crop',
    cta: 'Shop the edit'
  },
  {
    id: 'atelier',
    eyebrow: 'Crafted to last',
    title: 'The Atelier Collection',
    description: 'Hand-finished pieces from independent makers worldwide.',
    href: '/shop?sortBy=rating',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=1400&fit=crop',
    cta: 'Explore collection'
  }
] as const;

export const features = [
  {
    id: 1,
    title: 'Free Shipping',
    description: 'Complimentary delivery on orders over $100 worldwide.',
    icon: 'truck'
  },
  {
    id: 2,
    title: 'Premium Quality',
    description: 'Every item is vetted for materials, fit, and longevity.',
    icon: 'gem'
  },
  {
    id: 3,
    title: '2-Year Warranty',
    description: 'Extended protection on eligible products.',
    icon: 'shield'
  },
  {
    id: 4,
    title: '24/7 Support',
    description: 'Concierge-style help whenever you need it.',
    icon: 'headphones'
  }
] as const;

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Creative Director',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    content:
      'The quality from LUXE is unmatched. Every piece feels intentional — packaging, fit, and finish are all world-class.',
    rating: 5
  },
  {
    id: 2,
    name: 'James Chen',
    role: 'Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    content:
      'Finally a store that balances minimalist design with real functionality. Checkout was seamless and delivery was fast.',
    rating: 5
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Interior Designer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    content:
      'I recommend LUXE to clients constantly. The curation feels editorial without being pretentious.',
    rating: 5
  },
  {
    id: 4,
    name: 'David Okonkwo',
    role: 'Product Lead',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    content:
      'Returns were effortless when a size did not work. That level of service keeps me coming back.',
    rating: 5
  }
] as const;

const mockProduct = (
  partial: NonNullable<GetProducts200DataProductsItem['items']>
): GetProducts200DataProductsItem => ({
  is_liked: false,
  items: {
    status: 'active',
    ...partial
  }
});

export const MOCK_FEATURED_PRODUCTS: GetProducts200DataProductsItem[] = [
  mockProduct({
    id: 9001,
    name: 'Heritage Leather Weekender',
    slug: 'heritage-leather-weekender',
    sku: 'LUXE-WKND-01',
    price: 289,
    compare_at_price: 349,
    rating: 4.9,
    reviews_count: 214,
    is_new: true,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=1000&fit=crop'],
    category: { name: 'Accessories', slug: 'accessories' }
  }),
  mockProduct({
    id: 9002,
    name: 'Studio Wireless Headphones',
    slug: 'studio-wireless-headphones',
    sku: 'LUXE-AUD-02',
    price: 249,
    compare_at_price: 299,
    rating: 4.8,
    reviews_count: 189,
    is_new: false,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=1000&fit=crop'],
    category: { name: 'Electronics', slug: 'electronics' }
  }),
  mockProduct({
    id: 9003,
    name: 'Ceramic Pour-Over Set',
    slug: 'ceramic-pour-over-set',
    sku: 'LUXE-HOME-03',
    price: 78,
    rating: 4.7,
    reviews_count: 96,
    is_new: true,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=1000&fit=crop'],
    category: { name: 'Home & Living', slug: 'home' }
  }),
  mockProduct({
    id: 9004,
    name: 'Chronograph Steel Watch',
    slug: 'chronograph-steel-watch',
    sku: 'LUXE-WATCH-04',
    price: 420,
    compare_at_price: 499,
    rating: 4.9,
    reviews_count: 312,
    is_new: false,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1000&fit=crop'],
    category: { name: 'Accessories', slug: 'accessories' }
  }),
  mockProduct({
    id: 9005,
    name: 'Merino Lounge Set',
    slug: 'merino-lounge-set',
    sku: 'LUXE-APP-05',
    price: 165,
    rating: 4.6,
    reviews_count: 74,
    is_new: true,
    images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1000&fit=crop'],
    category: { name: 'Lifestyle', slug: 'lifestyle' }
  }),
  mockProduct({
    id: 9006,
    name: 'Sculpt Table Lamp',
    slug: 'sculpt-table-lamp',
    sku: 'LUXE-LIGHT-06',
    price: 195,
    compare_at_price: 240,
    rating: 4.8,
    reviews_count: 58,
    is_new: false,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=1000&fit=crop'],
    category: { name: 'Home & Living', slug: 'home' }
  }),
  mockProduct({
    id: 9007,
    name: 'Polarized Aviator Frames',
    slug: 'polarized-aviator-frames',
    sku: 'LUXE-EYE-07',
    price: 189,
    rating: 4.7,
    reviews_count: 143,
    is_new: true,
    images: ['https://images.unsplash.com/photo-1572635196233-14b40f21bd47?w=800&h=1000&fit=crop'],
    category: { name: 'Accessories', slug: 'accessories' }
  }),
  mockProduct({
    id: 9008,
    name: 'Hand-Stitched Card Holder',
    slug: 'hand-stitched-card-holder',
    sku: 'LUXE-ACC-08',
    price: 68,
    rating: 4.9,
    reviews_count: 201,
    is_new: false,
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=1000&fit=crop'],
    category: { name: 'Accessories', slug: 'accessories' }
  })
];

export const HERO_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1441984904996-e0b495a6de39?w=1600&h=2000&fit=crop';
