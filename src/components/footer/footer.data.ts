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
      { name: 'Best Sellers', href: '/store?sort=top_rated' },
      { name: 'Trending Now', href: '/shop?sortBy=trending' },
      { name: 'Sale', href: '/shop?showOnlySale=true', badge: '-30%' },
      { name: 'Gift Cards', href: '/gift-cards' },
      { name: 'Collections', href: '/collections' }
    ]
  },
  {
    title: 'Stores',
    links: [
      { name: 'Discover Stores', href: '/stores' },
      { name: 'Featured Brands', href: '/stores?featured=true' },
      { name: 'Verified Vendors', href: '/stores?verified=true' },
      { name: 'Open a Store', href: '/sell' },
      { name: 'Vendor Login', href: '/vendor/login' }
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
      { name: 'About Luxe', href: '/about' },
      { name: 'Sustainability', href: '/sustainability' },
      { name: 'Press', href: '/press' },
      { name: 'Careers', href: '/careers', badge: 'Hiring' },
      { name: 'Affiliates', href: '/affiliates' },
      { name: 'Investors', href: '/investors' }
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
  { name: 'Cookie Settings', href: '/legal/cookies' },
  { name: 'Accessibility', href: '/legal/accessibility' },
  { name: 'Sitemap', href: '/sitemap.xml' }
] as const;

export { footerSections, legalLinks, paymentMethods, socialLinks, trustBadges };
