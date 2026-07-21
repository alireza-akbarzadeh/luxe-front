import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { HOME_RAIL_SECTION_CLASS } from '@/domains/home/lib/home-density';
import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { getHomePopularCollections } from '@/services/-home-popular-collections-get';

import { HomeCollectionCard } from './ui/collection-card';

const COLLECTION_LIMIT = 4;

export async function CollectionBanner() {
  const [t, tCommon] = await Promise.all([
    getTranslations('home.collections'),
    getTranslations('home.common')
  ]);

  const data = await safeHomeFetch(() => getHomePopularCollections({ limit: COLLECTION_LIMIT }));

  const collections = data?.data?.collections ?? [];

  if (collections.length === 0) {
    return null;
  }

  return (
    <SectionCarousel
      sectionId='collections'
      className={HOME_RAIL_SECTION_CLASS}
      eyebrow={t('eyebrow')}
      title={t('title')}
      viewAllHref='/collections'
      viewAllLabel={t('viewAll')}
      columns={{ mobile: 1, tablet: 2, desktop: 2 }}
      loop={false}
    >
      {collections.map((collection, index) => (
        <HomeCollectionCard
          key={collection.id ?? index}
          banner={collection}
          index={index}
          fallbackLabel={tCommon('shopNow')}
        />
      ))}
    </SectionCarousel>
  );
}
