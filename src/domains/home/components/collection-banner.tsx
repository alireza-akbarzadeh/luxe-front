import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { CollectionCard } from '@/domains/collections/components/collection-card';
import { getHomePopularCollections } from '@/services/-home-popular-collections-get';

const COLLECTION_LIMIT = 4;

export async function CollectionBanner() {
  const t = await getTranslations('home.collections');

  const data = await getHomePopularCollections({ limit: COLLECTION_LIMIT });

  const collections = data?.data?.collections ?? [];

  if (collections.length === 0) {
    return null;
  }

  return (
    <SectionCarousel
      sectionId='collections'
      eyebrow={t('collections.eyebrow')}
      title={t('collections.title')}
      viewAllHref='/collections'
      viewAllLabel={t('collections.viewAll')}
    >
      {collections.map((collection, index) => (
        <CollectionCard key={collection.id ?? index} collection={collection} index={index} />
      ))}
    </SectionCarousel>
  );
}
