import { getTranslations } from 'next-intl/server';

import { buildFallbackHeroSlide, mapHeroSlide } from '@/domains/home/lib/hero-slides';
import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { getHomeHeroSlides } from '@/services/-home-hero-slides-get';

import { HeroSlidesCarousel } from './hero-slides-carousel';

const HERO_SLIDE_LIMIT = 6;

/**
 * Admin-driven hero carousel — sections with keys `hero-*` in Promotions → Banners.
 */
export async function HeroEditorialPanel() {
  const t = await getTranslations('home.hero.promoPanel');
  const data = await safeHomeFetch(() => getHomeHeroSlides({ limit: HERO_SLIDE_LIMIT }));
  const slides = data?.data?.slides?.map(mapHeroSlide).filter((slide) => slide != null) ?? [];

  const items =
    slides.length > 0
      ? slides
      : [
          buildFallbackHeroSlide({
            eyebrow: t('eyebrow'),
            title: t('title')
          })
        ];

  return <HeroSlidesCarousel slides={items} priorityFirst />;
}
