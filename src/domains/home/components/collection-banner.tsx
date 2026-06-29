'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetHomePopularCollections } from '@/services/-home-popular-collections-get';
import { SectionCarousel } from '~/src/components/section-carousel';
import { CollectionCard } from '~/src/domains/collections/components/collection-card';
import type { DtoHomeCollectionItem } from '~/src/services/-home-popular-collections-get.schemas';

import { useHomeContent } from '../hooks/use-home-content';

const COLLECTION_LIMIT = 4;

export function CollectionBanner() {
  const { t } = useHomeContent();
  const { data, isLoading, isError } = useGetHomePopularCollections({ limit: COLLECTION_LIMIT });

  const collections = data?.data?.collections ?? [];

  if (!isLoading && (isError || collections.length === 0)) return null;

  return (
    <SectionCarousel<DtoHomeCollectionItem>
      sectionId='collections'
      eyebrow={t('collections.eyebrow')}
      title={t('collections.title')}
      viewAllHref='/collections'
      viewAllLabel={t('collections.viewAll')}
      items={collections}
      isLoading={isLoading}
      columns={{ mobile: 1, tablet: 1, desktop: 2 }}
      renderItem={(banner, index) => <CollectionCard collection={banner} index={index} />}
      renderSkeleton={() => (
        <Skeleton className='min-h-[22rem] w-full rounded-2xl sm:min-h-[26rem] sm:rounded-3xl lg:min-h-[32rem]' />
      )}
    />
  );
}
