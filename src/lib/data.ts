export const categories = [
  {
    id: 1,
    name: 'Accessories',
    slug: 'accessories',
    description: 'Elevate your style',
    productCount: 48,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=600&fit=crop'
  },
  {
    id: 2,
    name: 'Home & Living',
    slug: 'home',
    description: 'Design your space',
    productCount: 36,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop'
  },
  {
    id: 3,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Premium tech essentials',
    productCount: 24,
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=600&fit=crop'
  },
  {
    id: 4,
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Curated for you',
    productCount: 52,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop'
  }
];

export const productCategories = [
  'All',
  'Accessories',
  'Watches',
  'Eyewear',
  'Electronics',
  'Home',
  'Kitchen',
  'Lighting'
];

export const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Rating', value: 'rating' }
];

export const priceRanges = [
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $300', min: 200, max: 300 },
  { label: 'Over $300', min: 300, max: Infinity }
];

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Creative Director',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    content:
      "The quality of products from Luxe is unmatched. Every piece I've purchased feels premium and timeless. Their attention to detail is remarkable.",
    rating: 5
  },
  {
    id: 2,
    name: 'James Chen',
    role: 'Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    content:
      'Finally found a brand that understands minimalist design without compromising on functionality. The customer service is exceptional too.',
    rating: 5
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Interior Designer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    content:
      'I recommend Luxe to all my clients. The products seamlessly blend into any interior while making a subtle statement. Pure elegance.',
    rating: 5
  }
];

export const features = [
  {
    id: 1,
    title: 'Free Shipping',
    description: 'On orders over $100',
    icon: 'truck'
  },
  {
    id: 2,
    title: 'Premium Quality',
    description: 'Handcrafted with care',
    icon: 'gem'
  },
  {
    id: 3,
    title: '2-Year Warranty',
    description: 'We stand behind our products',
    icon: 'shield'
  },
  {
    id: 4,
    title: '24/7 Support',
    description: 'Always here to help',
    icon: 'headphones'
  }
];

export const navLinks = [
  { name: 'Shop', href: '/shop' },
  { name: 'Categories', href: '/#categories' },
  { name: 'About', href: '/#features' },
  { name: 'Reviews', href: '/#testimonials' }
];
