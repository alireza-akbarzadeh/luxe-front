'use client';

import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Button } from '@/components/ui/button';

import { CollectionCard } from './components/collection-card';
import { CollectionPreviewRow } from './components/collection-preview-row';
import { CURATED_COLLECTIONS } from './lib/collections.config';

export function CollectionsDomain() {
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
      </div>

      <div className='app-container mt-14 space-y-16'>
        {CURATED_COLLECTIONS.map((collection, index) => (
          <section key={collection.id} className='scroll-mt-28'>
            <CollectionCard collection={collection} index={index} />
            <CollectionPreviewRow collection={collection} />
          </section>
        ))}
      </div>

      <div className='app-container mt-20'>
        <div className='border-border/60 bg-muted/20 rounded-3xl border px-6 py-10 text-center sm:px-10'>
          <h2 className='text-xl font-semibold tracking-tight'>Want the full catalog?</h2>
          <p className='text-muted-foreground mx-auto mt-2 max-w-lg text-sm'>
            Browse every product with filters for category, price, rating, and more.
          </p>
          <Button asChild className='mt-6 rounded-full' size='lg'>
            <Link href='/shop'>Open shop</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
