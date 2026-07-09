import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { getHomeSeasonalPicks } from '@/services/-home-seasonal-picks-get';

import { SeasonalPickCard } from './ui/seasonal-pick-card';

const SEASONAL_LIMIT = 4;

export async function SeasonalPicksSection() {
  const [t, tCommon] = await Promise.all([
    getTranslations('home.seasonalPicks'),
    getTranslations('home.common')
  ]);

  const data = await safeHomeFetch(() => getHomeSeasonalPicks({ limit: SEASONAL_LIMIT }));
  const sections = data?.data?.sections ?? [];

  if (sections.length === 0) {
    return null;
  }

  return (
    <SectionCarousel
      sectionId='seasonal-picks'
      eyebrow={t('eyebrow')}
      title={t('title')}
      viewAllHref='/shop'
      viewAllLabel={t('viewAll')}
      columns={{ mobile: 1, tablet: 2, desktop: 3 }}
      loop={false}
    >
      {sections.map((section, index) => (
        <SeasonalPickCard
          key={section.key ?? section.title ?? index}
          section={section}
          fallbackLabel={tCommon('shopNow')}
        />
      ))}
    </SectionCarousel>
  );
}
