import { getLocale, getTranslations } from 'next-intl/server';

import type { Locale } from '@/i18n/config';
import { getHomeMarketingCopyParams } from '@/lib/i18n/marketing-copy-params';

import {
  FEATURE_ITEMS,
  HOME_HOW_IT_WORKS,
  HOME_PLATFORM_STATS,
  MARKETPLACE_BENEFIT_KEYS,
  MARKETPLACE_TILE_KEYS,
  type Testimonial,
  TESTIMONIAL_ITEMS
} from './home-mock-data';

/** Server-side translated copy for static home marketing sections. */
export async function getHomeContent() {
  const t = await getTranslations('home');
  const locale = (await getLocale()) as Locale;
  const marketingCopy = getHomeMarketingCopyParams();

  const howItWorks = HOME_HOW_IT_WORKS.map((step) => ({
    step: step.step,
    title: t(`howItWorks.steps.${step.key}.title`),
    description: t(`howItWorks.steps.${step.key}.description`)
  }));

  const marketplaceBenefits = MARKETPLACE_BENEFIT_KEYS.map((key) => ({
    title: t(`marketplace.benefits.${key}.title`),
    description: t(`marketplace.benefits.${key}.description`)
  }));

  const marketplaceTiles = MARKETPLACE_TILE_KEYS.map((key) => t(`marketplace.tiles.${key}`));

  const featureItemParams = {
    shipping: { amount: marketingCopy.features.amount },
    quality: {},
    warranty: { years: marketingCopy.features.years },
    support: { hours: marketingCopy.features.hours, days: marketingCopy.features.days }
  } as const;

  const features = FEATURE_ITEMS.map((item) => ({
    id: item.id,
    icon: item.icon,
    title: t(`features.items.${item.key}.title`, featureItemParams[item.key]),
    description: t(`features.items.${item.key}.description`, featureItemParams[item.key])
  }));

  const platformStats = HOME_PLATFORM_STATS.map((stat) => ({
    value: stat.value,
    suffix: stat.suffix,
    decimals: 'decimals' in stat ? stat.decimals : 0,
    label: t(`statsSection.items.${stat.key}`)
  }));

  const testimonialItems: Testimonial[] = TESTIMONIAL_ITEMS.map((item) => ({
    id: item.id,
    key: item.key,
    avatar: item.avatar,
    rating: item.rating,
    name: t(`testimonials.items.${item.key}.name`),
    role: t(`testimonials.items.${item.key}.role`),
    content: t(`testimonials.items.${item.key}.content`)
  }));

  return {
    howItWorks,
    marketplaceBenefits,
    marketplaceTiles,
    features,
    platformStats,
    testimonialItems,
    marketingCopy,
    locale,
    t
  };
}

export type HomeContent = Awaited<ReturnType<typeof getHomeContent>>;
