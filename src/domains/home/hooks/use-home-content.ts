'use client';

import { useLocale, useTranslations } from 'next-intl';

import type { Locale } from '@/i18n/config';
import { formatLocaleCompact } from '@/lib/i18n/format-number';
import { getHomeMarketingCopyParams } from '@/lib/i18n/marketing-copy-params';

import {
  FEATURE_ITEMS,
  HOME_HOW_IT_WORKS,
  HOME_PLATFORM_STATS,
  HOME_STATS,
  MARKETPLACE_BENEFIT_KEYS,
  MARKETPLACE_TILE_KEYS,
  type Testimonial,
  TESTIMONIAL_ITEMS
} from '../lib/home-mock-data';

function formatHeroStatValue(value: number, suffix: string, locale: Locale) {
  return `${formatLocaleCompact(value, locale)}${suffix}`;
}

/** Translated copy for the home landing page sections. */
export function useHomeContent() {
  const t = useTranslations('home');
  const locale = useLocale() as Locale;
  const copy = getHomeMarketingCopyParams();

  const heroStats = HOME_STATS.map((stat) => ({
    value: formatHeroStatValue(stat.value, stat.suffix, locale),
    label: t(`hero.stats.${stat.key}`)
  }));

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
    shipping: { amount: copy.features.amount },
    quality: {},
    warranty: { years: copy.features.years },
    support: { hours: copy.features.hours, days: copy.features.days }
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
    heroStats,
    howItWorks,
    marketplaceBenefits,
    marketplaceTiles,
    features,
    platformStats,
    testimonialItems,
    marketingCopy: copy,
    locale,
    t
  };
}
