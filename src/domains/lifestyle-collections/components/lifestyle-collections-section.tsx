import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { LIFESTYLE_COLLECTIONS_FALLBACK } from '@/domains/lifestyle-collections/lib/lifestyle-collections.config';
import { getCollections } from '@/services/-collections-get';

import { LifestyleCollectionCard } from './lifestyle-collection-card';

const LIFESTYLE_LIMIT = 6;

/** Homepage carousel of lifestyle-themed curated collections. */
export async function LifestyleCollectionsSection() {
  const t = await getTranslations('home.lifestyleCollections');

  const data = await safeHomeFetch(() =>
    getCollections({
      status: 'active',
      theme: 'lifestyle',
      limit: LIFESTYLE_LIMIT,
      page: 1,
    })
  );

  const collections = data?.data?.collections?.length
    ? data.data.collections
    : LIFESTYLE_COLLECTIONS_FALLBACK;

  if (collections.length === 0) {
    return null;
  }

  return (
    <SectionCarousel
      sectionId='lifestyle-collections'
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      viewAllHref='/lifestyle'
      viewAllLabel={t('viewAll')}
      columns={{ mobile: 1, tablet: 2, desktop: 3 }}
      loop={false}
    >
      {collections.map((collection, index) => (
        <LifestyleCollectionCard
          key={collection.id ?? collection.slug ?? index}
          collection={collection}
          ctaLabel={t('shopLabel')}
        />
      ))}
    </SectionCarousel>
  );
}
