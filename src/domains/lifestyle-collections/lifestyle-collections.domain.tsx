'use client';

import { IconChevronRight } from '@tabler/icons-react';
import { useMemo } from 'react';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Skeleton } from '@/components/ui/skeleton';
import { CollectionCard } from '@/domains/collections/components/collection-card';
import { LIFESTYLE_COLLECTIONS_FALLBACK } from '@/domains/lifestyle-collections/lib/lifestyle-collections.config';
import { useGetCollections } from '@/services/-collections-get';
import type { DtoCollectionListResponse } from '@/services/-collections-get.schemas';

/** Full-page lifestyle collections — Minimal Workspace, Travel Essentials, and more. */
export function LifestyleCollectionsDomain() {
  const { data: listResponse, isLoading } = useGetCollections(
    { status: 'active', theme: 'lifestyle', limit: 12, page: 1 },
    { query: { staleTime: 60_000 } }
  );

  const listData = listResponse as DtoCollectionListResponse | undefined;

  const collections = useMemo(() => {
    const fromApi = listData?.data?.collections ?? [];
    return fromApi.length > 0 ? fromApi : LIFESTYLE_COLLECTIONS_FALLBACK;
  }, [listData]);

  const showSkeleton = isLoading && !listData?.data?.collections?.length;

  return (
    <main className='pb-24'>
      <div className='app-container pt-24'>
        <DynamicBreadcrumb
          items={[{ label: 'Lifestyle' }]}
          direction='column'
          separator={<IconChevronRight className='h-3 w-3' />}
          className='text-muted-foreground text-xs'
          breadcrumbClassName='flex items-center gap-1.5'
          showBackButton={false}
        />

        <div className='mt-10 max-w-3xl'>
          <p className='text-accent mb-3 text-xs font-semibold tracking-[0.2em] uppercase'>
            Curated for how you live
          </p>
          <h1 className='font-display text-4xl font-bold tracking-tight lg:text-5xl'>
            Lifestyle collections
          </h1>
          <p className='text-muted-foreground mt-4 text-base leading-relaxed'>
            Room-by-room and moment-by-moment edits — from a calm desk setup to your first apartment
            essentials.
          </p>
        </div>
      </div>

      <div className='app-container mt-16 space-y-16 lg:mt-20 lg:space-y-20'>
        {showSkeleton ? (
          <div className='space-y-6'>
            <Skeleton className='h-64 w-full rounded-[2rem]' />
            <Skeleton className='h-64 w-full rounded-[2rem]' />
          </div>
        ) : (
          collections.map((collection, index) => (
            <section key={collection.id ?? collection.slug} className='scroll-mt-28'>
              <div className='border-border/50 bg-muted/15 rounded-[2rem] border p-4 sm:rounded-[2.25rem] sm:p-5 lg:p-6'>
                <CollectionCard collection={collection} index={index} />
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
