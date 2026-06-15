import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandPinterest,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandYoutube,
  IconHeadphones,
  IconRotateClockwise2,
  IconShieldCheck,
  IconTruck
} from '@tabler/icons-react';

const trustBadges = [
  {
    icon: IconTruck,
    title: 'Free Shipping',
    subtitle: 'On orders over $150'
  },
  {
    icon: IconRotateClockwise2,
    title: '30-Day Returns',
    subtitle: 'Hassle-free, on us'
  },
  {
    icon: IconShieldCheck,
    title: 'Authenticity',
    subtitle: '100% verified brands'
  },
  {
    icon: IconHeadphones,
    title: '24/7 Concierge',
    subtitle: 'Real humans, always'
  }
] as const;

const footerSections = [
  {
    title: 'Shop',
    links: [
      { name: 'New Arrivals', href: '/shop?sortBy=newest&showOnlyNew=true', badge: 'New' },
      { name: 'Best Sellers', href: '/shop?sortBy=rating_desc' },
      { name: 'Trending Now', href: '/shop?sortBy=trending' },
      { name: 'Sale', href: '/shop?showOnlySale=true', badge: '-30%' },
      { name: 'Gift Cards', href: '/gift-cards' },
      { name: 'Collections', href: '/collections' }
    ]
  },
  {
    title: 'Stores',
    links: [
      { name: 'Discover Stores', href: '/store' },
      { name: 'Top Rated', href: '/store?sort=top_rated' },
      { name: 'Verified Vendors', href: '/store?verified=true' },
      { name: 'Partner With Us', href: '/contact' },
      { name: 'Vendor Login', href: '/login?callbackUrl=%2Fdashboard' }
    ]
  },
  {
    title: 'Help & Support',
    links: [
      { name: 'Order Tracking', href: '/help/order-tracking' },
      { name: 'Shipping & Delivery', href: '/help/shipping' },
      { name: 'Returns & Refunds', href: '/help/returns' },
      { name: 'Size Guide', href: '/help/size-guide' },
      { name: 'FAQ', href: '/help/faq' },
      { name: 'Contact Us', href: '/contact' }
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Shop Luxe', href: '/shop' },
      { name: 'Our Stores', href: '/store' }
    ]
  }
] as const;

const socialLinks = [
  { name: 'Instagram', icon: IconBrandInstagram, href: 'https://instagram.com' },
  { name: 'TikTok', icon: IconBrandTiktok, href: 'https://tiktok.com' },
  { name: 'Pinterest', icon: IconBrandPinterest, href: 'https://pinterest.com' },
  { name: 'Twitter', icon: IconBrandTwitter, href: 'https://twitter.com' },
  { name: 'YouTube', icon: IconBrandYoutube, href: 'https://youtube.com' },
  { name: 'Facebook', icon: IconBrandFacebook, href: 'https://facebook.com' }
] as const;

const paymentMethods = [
  'Visa',
  'Mastercard',
  'Amex',
  'PayPal',
  'Apple Pay',
  'Google Pay',
  'Klarna',
  'Crypto'
] as const;

const legalLinks = [
  { name: 'Privacy Policy', href: '/legal/privacy' },
  { name: 'Terms of Service', href: '/legal/terms' },
  { name: 'Cookie Policy', href: '/legal/cookies' },
  { name: 'Accessibility', href: '/legal/accessibility' }
] as const;

export { footerSections, legalLinks, paymentMethods, socialLinks, trustBadges };
