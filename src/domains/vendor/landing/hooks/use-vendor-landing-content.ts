'use client';

import { useTranslations } from 'next-intl';

import {
  FAQ_ITEM_IDS,
  HOW_IT_WORKS_STEP_IDS,
  PRICING_PLAN_IDS,
  TRUST_STAT_IDS,
  VENDOR_NAV_LINK_IDS,
  WHY_SELL_FEATURE_IDS,
  WHY_SELL_FEATURES
} from '@/domains/vendor/landing/data/vendor-landing.data';

const NAV_LINK_HREFS: Record<(typeof VENDOR_NAV_LINK_IDS)[number], string> = {
  features: '#features',
  pricing: '#pricing',
  successStories: '#success-stories',
  faq: '#faq',
  contact: '#contact'
};

const TRUST_STAT_VALUES: Record<(typeof TRUST_STAT_IDS)[number], string> = {
  vendors: '10,000+',
  shoppers: '5M+',
  sales: '$250M+'
};

const PRICING_COMMISSION: Record<(typeof PRICING_PLAN_IDS)[number], string> = {
  starter: '12%',
  growth: '8%',
  enterprise: 'Custom'
};

const PRICING_MONTHLY: Record<(typeof PRICING_PLAN_IDS)[number], string> = {
  starter: '$0',
  growth: '$49',
  enterprise: 'Custom'
};

const PRICING_FEATURE_KEYS: Record<(typeof PRICING_PLAN_IDS)[number], readonly string[]> = {
  starter: ['skus', 'payouts', 'analytics', 'support'],
  growth: ['skus', 'payouts', 'analytics', 'promotions', 'featured', 'support'],
  enterprise: ['manager', 'api', 'warehouse', 'integrations', 'support']
};

/** Translated vendor landing marketing copy (not mock dashboard API preview data). */
export function useVendorLandingContent() {
  const t = useTranslations('vendor.landing');

  return {
    screen: {
      title: t('screen.title'),
      subtitle: t('screen.subtitle')
    },
    navLinks: VENDOR_NAV_LINK_IDS.map((id) => ({
      id,
      label: t(`nav.links.${id}`),
      href: NAV_LINK_HREFS[id]
    })),
    trustStats: TRUST_STAT_IDS.map((id) => ({
      id,
      value: TRUST_STAT_VALUES[id],
      label: t(`trustStats.${id}.label`)
    })),
    whySellFeatures: WHY_SELL_FEATURE_IDS.map((id, index) => ({
      id,
      icon: WHY_SELL_FEATURES[index]?.icon,
      title: t(`whySell.${id}.title`),
      description: t(`whySell.${id}.description`),
      bullets: WHY_SELL_FEATURES[index]?.bullets
    })),
    howItWorksSteps: HOW_IT_WORKS_STEP_IDS.map((id, index) => ({
      id,
      step: `0${index + 1}`,
      title: t(`howItWorks.${id}.title`),
      description: t(`howItWorks.${id}.description`)
    })),
    pricingPlans: PRICING_PLAN_IDS.map((id) => ({
      id,
      name: t(`pricing.${id}.name`),
      description: t(`pricing.${id}.description`),
      commission: PRICING_COMMISSION[id],
      monthlyFee: PRICING_MONTHLY[id],
      features: PRICING_FEATURE_KEYS[id].map((key) =>
        t(`pricing.${id}.features.${key}` as Parameters<typeof t>[0])
      ),
      cta: t(`pricing.cta.${id}`),
      highlighted: id === 'growth'
    })),
    faqItems: FAQ_ITEM_IDS.map((id) => ({
      id,
      question: t(`faq.${id}.question`),
      answer: t(`faq.${id}.answer`)
    }))
  };
}
