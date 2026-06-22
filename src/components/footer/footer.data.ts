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

type FooterLinkKey =
  | 'newArrivals'
  | 'bestSellers'
  | 'trendingNow'
  | 'sale'
  | 'giftCards'
  | 'collections'
  | 'discoverStores'
  | 'topRated'
  | 'verifiedVendors'
  | 'sellOnLuxe'
  | 'vendorSignIn'
  | 'vendorPanel'
  | 'orderTracking'
  | 'shippingDelivery'
  | 'returnsRefunds'
  | 'sizeGuide'
  | 'faq'
  | 'contactUs'
  | 'getLuxeApp'
  | 'helpCenter'
  | 'shopLuxe'
  | 'ourStores';

type FooterSectionKey = 'shop' | 'stores' | 'help' | 'company';

type LegalLinkKey = 'privacy' | 'terms' | 'cookies' | 'accessibility';

type TrustBadgeKey = 'freeShipping' | 'returns' | 'authenticity' | 'concierge';

const trustBadges: ReadonlyArray<{
  key: TrustBadgeKey;
  icon: typeof IconTruck;
}> = [
  { key: 'freeShipping', icon: IconTruck },
  { key: 'returns', icon: IconRotateClockwise2 },
  { key: 'authenticity', icon: IconShieldCheck },
  { key: 'concierge', icon: IconHeadphones }
] as const;

const footerSections: ReadonlyArray<{
  titleKey: FooterSectionKey;
  links: ReadonlyArray<{ nameKey: FooterLinkKey; href: string; badge?: string }>;
}> = [
  {
    titleKey: 'shop',
    links: [
      { nameKey: 'newArrivals', href: '/shop?sortBy=newest&showOnlyNew=true', badge: 'New' },
      { nameKey: 'bestSellers', href: '/shop?sortBy=rating_desc' },
      { nameKey: 'trendingNow', href: '/shop?sortBy=trending' },
      { nameKey: 'sale', href: '/shop?showOnlySale=true', badge: '-30%' },
      { nameKey: 'giftCards', href: '/gift-cards' },
      { nameKey: 'collections', href: '/collections' }
    ]
  },
  {
    titleKey: 'stores',
    links: [
      { nameKey: 'discoverStores', href: '/store' },
      { nameKey: 'topRated', href: '/store?sort=top_rated' },
      { nameKey: 'verifiedVendors', href: '/store?verified=true' },
      { nameKey: 'sellOnLuxe', href: '/vendor' },
      { nameKey: 'vendorSignIn', href: '/vendor/login' },
      { nameKey: 'vendorPanel', href: '/vendor/panel' }
    ]
  },
  {
    titleKey: 'help',
    links: [
      { nameKey: 'orderTracking', href: '/help/order-tracking' },
      { nameKey: 'shippingDelivery', href: '/help/shipping' },
      { nameKey: 'returnsRefunds', href: '/help/returns' },
      { nameKey: 'sizeGuide', href: '/help/size-guide' },
      { nameKey: 'faq', href: '/help/faq' },
      { nameKey: 'contactUs', href: '/contact' },
      { nameKey: 'getLuxeApp', href: '/apps' }
    ]
  },
  {
    titleKey: 'company',
    links: [
      { nameKey: 'helpCenter', href: '/help' },
      { nameKey: 'contactUs', href: '/contact' },
      { nameKey: 'shopLuxe', href: '/shop' },
      { nameKey: 'ourStores', href: '/store' }
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

const legalLinks: ReadonlyArray<{ key: LegalLinkKey; href: string }> = [
  { key: 'privacy', href: '/legal/privacy' },
  { key: 'terms', href: '/legal/terms' },
  { key: 'cookies', href: '/legal/cookies' },
  { key: 'accessibility', href: '/legal/accessibility' }
] as const;

export { footerSections, legalLinks, paymentMethods, socialLinks, trustBadges };

export type { FooterLinkKey, FooterSectionKey, LegalLinkKey, TrustBadgeKey };
