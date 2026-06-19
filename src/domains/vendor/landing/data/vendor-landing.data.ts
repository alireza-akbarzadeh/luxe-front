import type { TablerIcon } from '@tabler/icons-react';
import {
  IconBox,
  IconBrandGoogle,
  IconBrandMeta,
  IconBrandPaypal,
  IconBrandStripe,
  IconBrandTiktok,
  IconChartBar,
  IconCreditCard,
  IconDeviceMobile,
  IconMail,
  IconMessage,
  IconPackage,
  IconPercentage,
  IconReportAnalytics,
  IconRobot,
  IconShieldCheck,
  IconTruck,
  IconUsers,
  IconWorld
} from '@tabler/icons-react';

export const VENDOR_NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Success Stories', href: '#success-stories' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' }
] as const;

export const TRUSTED_BRANDS = [
  'Maison Noir',
  'Velvet & Co',
  'Atelier Bloom',
  'Northline',
  'Cedar Studio',
  'Lumière',
  'Forma Goods',
  'Oak & Thread'
] as const;

export const TRUST_STATS = [
  { value: '10,000+', label: 'Active vendors' },
  { value: '5M+', label: 'Monthly shoppers' },
  { value: '$250M+', label: 'Sales processed' }
] as const;

export const WHY_SELL_FEATURES: {
  icon: TablerIcon;
  title: string;
  description: string;
  bullets?: string[];
}[] = [
  {
    icon: IconUsers,
    title: 'Massive customer reach',
    description: 'Get discovered by millions of buyers browsing curated collections and premium categories.'
  },
  {
    icon: IconPackage,
    title: 'Easy product management',
    description: 'Manage catalog, variants, and inventory from one intuitive vendor dashboard.'
  },
  {
    icon: IconShieldCheck,
    title: 'Secure payments',
    description: 'Fast payouts with trusted payment providers and transparent settlement reporting.'
  },
  {
    icon: IconPercentage,
    title: 'Marketing tools',
    description: 'Run promotions that convert.',
    bullets: ['Coupons', 'Featured products', 'Email campaigns', 'Seasonal promotions']
  },
  {
    icon: IconChartBar,
    title: 'Analytics',
    description: 'Make decisions with clarity.',
    bullets: ['Sales reports', 'Inventory insights', 'Performance metrics', 'Customer trends']
  },
  {
    icon: IconDeviceMobile,
    title: 'Mobile-ready',
    description: 'Manage your store, orders, and messages from anywhere — desktop or mobile.'
  }
];

export const MARKETPLACE_BENEFITS = [
  'Increase revenue with built-in discovery',
  'Expand your audience across 120+ countries',
  'Lower operational costs with unified tooling',
  'Fast onboarding — live in days, not months',
  'Dedicated seller success support',
  'Automated shipping label workflows',
  'Real-time inventory syncing',
  'Marketing campaigns & featured placements',
  'SEO-optimized storefront pages',
  'Verified customer reviews & social proof'
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Create account',
    description: 'Sign up, verify your business, and complete your vendor profile in minutes.'
  },
  {
    step: '02',
    title: 'Add products',
    description: 'Upload catalog, variants, and media. Import in bulk or add items one by one.'
  },
  {
    step: '03',
    title: 'Receive orders',
    description: 'Get notified instantly. Fulfill from your dashboard with shipping integrations.'
  },
  {
    step: '04',
    title: 'Get paid',
    description: 'Track payouts, commissions, and statements — deposited on your schedule.'
  }
] as const;

export const PLATFORM_STATS = [
  { value: 25000, suffix: '+', label: 'Vendors' },
  { value: 5, suffix: 'M+', label: 'Customers' },
  { value: 120, suffix: '+', label: 'Countries' },
  { value: 99.9, suffix: '%', label: 'Platform uptime', decimals: 1 },
  { value: 250, suffix: 'M+', label: 'Orders processed' },
  { value: 4.9, suffix: '★', label: 'Vendor satisfaction', decimals: 1 }
] as const;

export const TESTIMONIALS = [
  {
    name: 'Elena Marchetti',
    business: 'Maison Marchetti',
    avatar: 'EM',
    quote:
      'Luxe gave us enterprise-grade tools without enterprise complexity. Our team ships faster and sells more.',
    metrics: [
      { label: 'Sales growth', value: '+340%' },
      { label: 'Orders', value: '+5,000' },
      { label: 'Selling', value: '12 months' }
    ]
  },
  {
    name: 'James Okonkwo',
    business: 'Northline Supply',
    avatar: 'JO',
    quote:
      'The analytics and payout transparency alone paid for themselves. We expanded to three new regions in one quarter.',
    metrics: [
      { label: 'Revenue', value: '+210%' },
      { label: 'Markets', value: '3 new' },
      { label: 'Selling', value: '8 months' }
    ]
  },
  {
    name: 'Sofia Andersson',
    business: 'Cedar Studio',
    avatar: 'SA',
    quote:
      'From onboarding to first sale took less than a week. Support actually understands marketplace sellers.',
    metrics: [
      { label: 'Time to sale', value: '6 days' },
      { label: 'Repeat buyers', value: '42%' },
      { label: 'Selling', value: '18 months' }
    ]
  }
] as const;

export const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For new sellers testing the marketplace.',
    commission: '12%',
    monthlyFee: '$0',
    features: ['Up to 100 SKUs', 'Standard payouts', 'Basic analytics', 'Email support'],
    cta: 'Start selling',
    highlighted: false
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'For scaling brands ready to accelerate.',
    commission: '8%',
    monthlyFee: '$49',
    features: [
      'Unlimited SKUs',
      'Priority payouts',
      'Advanced analytics',
      'Coupons & promotions',
      'Featured listing credits',
      'Priority support'
    ],
    cta: 'Start with Growth',
    highlighted: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For high-volume operators and multi-store teams.',
    commission: 'Custom',
    monthlyFee: 'Custom',
    features: [
      'Dedicated account manager',
      'API & bulk import',
      'Multi-warehouse',
      'Custom integrations',
      'SLA-backed support',
      'Co-marketing programs'
    ],
    cta: 'Talk to sales',
    highlighted: false
  }
] as const;

export const INTEGRATIONS = [
  { name: 'Stripe', icon: IconBrandStripe },
  { name: 'PayPal', icon: IconBrandPaypal },
  { name: 'Google Analytics', icon: IconBrandGoogle },
  { name: 'Meta', icon: IconBrandMeta },
  { name: 'TikTok', icon: IconBrandTiktok },
  { name: 'Mailchimp', icon: IconMail },
  { name: 'Shippo', icon: IconTruck },
  { name: 'FedEx', icon: IconPackage },
  { name: 'UPS', icon: IconBox },
  { name: 'DHL', icon: IconWorld },
  { name: 'QuickBooks', icon: IconReportAnalytics },
  { name: 'Zapier', icon: IconRobot }
] as const;

export const FAQ_ITEMS = [
  {
    question: 'How do payouts work?',
    answer:
      'Payouts are deposited on a rolling schedule based on your plan. You can track pending, available, and paid balances in the vendor dashboard. Enterprise sellers can negotiate custom settlement terms.'
  },
  {
    question: 'How much commission do you charge?',
    answer:
      'Commission depends on your plan — Starter is 12%, Growth is 8%, and Enterprise is negotiated. There are no hidden listing fees on Growth and above.'
  },
  {
    question: 'Can I sell internationally?',
    answer:
      'Yes. Luxe supports cross-border selling with localized checkout, currency display, and integrated carriers. You control which markets you ship to.'
  },
  {
    question: 'How long does approval take?',
    answer:
      'Most applications are reviewed within 2–3 business days. Complete profiles with verified business details are typically approved faster.'
  },
  {
    question: 'Can I import products in bulk?',
    answer:
      'Yes. Use CSV import on Growth plans or connect via API on Enterprise. Map variants, inventory, and media in a single workflow.'
  },
  {
    question: 'Do you support product variants?',
    answer:
      'Full variant support — size, color, material, and custom options — with per-variant inventory and pricing.'
  },
  {
    question: 'How are returns handled?',
    answer:
      'Returns flow through the same order system customers use. You set policies per store; Luxe provides RMA labels and status tracking in your panel.'
  }
] as const;

export const ALTERNATING_FEATURES = [
  {
    id: 'inventory',
    title: 'Inventory management',
    description: 'Stay in sync across channels with real-time stock levels and low-stock alerts.',
    bullets: ['Multi-location stock', 'Bulk updates', 'Reserved inventory', 'Audit history'],
    icon: IconPackage
  },
  {
    id: 'fulfillment',
    title: 'Order fulfillment',
    description: 'Pick, pack, and ship from one queue with carrier rates and label printing built in.',
    bullets: ['Batch processing', 'Shipping rules', 'Tracking sync', 'SLA reminders'],
    icon: IconTruck
  },
  {
    id: 'marketing',
    title: 'Marketing automation',
    description: 'Launch campaigns that drive repeat purchases without leaving your dashboard.',
    bullets: ['Coupon codes', 'Featured slots', 'Abandoned cart', 'Seasonal promos'],
    icon: IconPercentage
  },
  {
    id: 'messaging',
    title: 'Customer messaging',
    description: 'Respond to buyers quickly with threaded conversations tied to each order.',
    bullets: ['Order context', 'Templates', 'Mobile alerts', 'Moderation tools'],
    icon: IconMessage
  },
  {
    id: 'insights',
    title: 'Performance insights',
    description: 'Understand what sells, where, and why — with exportable reports.',
    bullets: ['Revenue trends', 'SKU performance', 'Geographic breakdown', 'Conversion funnels'],
    icon: IconReportAnalytics
  },
  {
    id: 'payments',
    title: 'Tax & payouts',
    description: 'Transparent commissions, tax summaries, and payout schedules you can trust.',
    bullets: ['Stripe Connect', 'Tax reports', 'Invoice exports', 'Multi-currency'],
    icon: IconCreditCard
  }
] as const;

export const DASHBOARD_METRICS = [
  { label: 'Revenue', value: '$48,290', change: '+18.2%', positive: true },
  { label: 'Orders', value: '1,284', change: '+12.4%', positive: true },
  { label: 'Products', value: '342', change: '+6', positive: true },
  { label: 'Customers', value: '8,921', change: '+9.1%', positive: true }
] as const;

export const FOOTER_SECTIONS = {
  company: [
    { label: 'About', href: '/contact' },
    { label: 'Careers', href: '/contact' },
    { label: 'Press', href: '/contact' },
    { label: 'Contact', href: '/contact' }
  ],
  marketplace: [
    { label: 'Browse stores', href: '/store' },
    { label: 'Sell on Luxe', href: '/vendor' },
    { label: 'Vendor sign in', href: '/vendor/login' },
    { label: 'Pricing', href: '#pricing' }
  ],
  resources: [
    { label: 'Help center', href: '/help' },
    { label: 'Seller guides', href: '/help' },
    { label: 'API docs', href: '/help' },
    { label: 'Blog', href: '/help' }
  ],
  support: [
    { label: 'FAQ', href: '#faq' },
    { label: 'Shipping', href: '/help/shipping' },
    { label: 'Returns', href: '/help/returns' },
    { label: 'Status', href: '/help' }
  ],
  legal: [
    { label: 'Terms', href: '/legal/terms' },
    { label: 'Privacy', href: '/legal/privacy' },
    { label: 'Cookies', href: '/legal/cookies' },
    { label: 'Accessibility', href: '/legal/accessibility' }
  ]
} as const;

export const FOOTER_CONTACT = {
  email: 'vendors@luxe.com',
  phone: '+1 (800) 555-0199',
  address: '100 Market Street, San Francisco, CA'
} as const;
