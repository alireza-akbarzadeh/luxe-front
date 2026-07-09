'use client';

import { IconArrowRight, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCollections } from '@/services/-collections-get';
import type { DtoCollectionListResponse } from '@/services/-collections-get.schemas';

import { CollectionCard } from './components/collection-card';
import { CollectionHeroGrid } from './components/collection-hero-grid';
import { CollectionPreviewRow } from './components/collection-preview-row';
import { CURATED_COLLECTIONS } from './lib/collections.config';

export function CollectionsDomain() {
  const { data: listResponse, isLoading } = useGetCollections(
    { status: 'active', live_only: true, limit: 100, page: 1 },
    { query: { staleTime: 60_000 } }
  );

  const listData = listResponse as DtoCollectionListResponse | undefined;

  const collections = useMemo(() => {
    const fromApi = listData?.data?.collections ?? [];
    return fromApi.length > 0 ? fromApi : CURATED_COLLECTIONS;
  }, [listData]);

  const showSkeleton = isLoading && !listData?.data?.collections?.length;

  return (
    <main className='pb-24'>
      <div className='app-container pt-24'>
        <DynamicBreadcrumb
          items={[{ label: 'Collections' }]}
          direction='column'
          separator={<IconChevronRight className='h-3 w-3' />}
          className='text-muted-foreground text-xs'
          breadcrumbClassName='flex items-center gap-1.5'
          showBackButton={false}
        />

        <div className='mt-10 max-w-3xl'>
          <p className='text-accent mb-3 text-xs font-semibold tracking-[0.2em] uppercase'>
            Curated edits
          </p>
          <h1 className='font-display text-4xl font-bold tracking-tight lg:text-5xl'>
            Shop by collection
          </h1>
          <p className='text-muted-foreground mt-4 text-base leading-relaxed'>
            Seasonal edits and themed groups to help you discover products faster. Each collection
            opens a filtered view of the marketplace catalog.
          </p>
        </div>

        <CollectionHeroGrid collections={collections} />
      </div>

      <div className='app-container mt-20 space-y-16 lg:mt-24 lg:space-y-20'>
        {showSkeleton ? (
          <div className='space-y-6'>
            <Skeleton className='h-64 w-full rounded-[2rem]' />
            <Skeleton className='h-64 w-full rounded-[2rem]' />
          </div>
        ) : (
          collections.map((collection, index) => (
            <section key={collection.id} className='scroll-mt-28'>
              <div className='border-border/50 bg-muted/15 rounded-[2rem] border p-4 sm:rounded-[2.25rem] sm:p-5 lg:p-6'>
                <CollectionCard collection={collection} index={index} />
                <CollectionPreviewRow collection={collection} className='px-1 sm:px-2' />
              </div>
            </section>
          ))
        )}
      </div>

      <div className='app-container mt-20 lg:mt-24'>
        <div className='border-border/60 from-muted/30 to-muted/10 relative overflow-hidden rounded-[2rem] border bg-gradient-to-br px-6 py-12 text-center sm:px-10 sm:py-14'>
          <div className='bg-gold/10 pointer-events-none absolute -top-20 right-0 h-56 w-56 rounded-full blur-3xl' />
          <div className='relative'>
            <p className='text-accent text-xs font-semibold tracking-[0.2em] uppercase'>
              Full catalog
            </p>
            <h2 className='font-display mt-3 text-2xl font-semibold tracking-tight sm:text-3xl'>
              Want every product in one place?
            </h2>
            <p className='text-muted-foreground mx-auto mt-3 max-w-lg text-sm leading-relaxed'>
              Browse the complete marketplace with filters for category, price, rating, and more.
            </p>
            <Button asChild className='mt-8 rounded-full' size='lg'>
              <Link href='/shop'>
                Open shop
                <IconArrowRight className='ml-2 size-4' />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
