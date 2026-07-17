'use client';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoCollectionResponse } from '@/services/-collections-get.schemas';

interface CollectionDetailHeroProps {
  collection: DtoCollectionResponse;
  productCount: number;
}

/** Premium editorial hero for a storefront collection page. */
export function CollectionDetailHero({ collection, productCount }: CollectionDetailHeroProps) {
  return (
    <section className='relative overflow-hidden rounded-[2rem] border bg-zinc-950 text-white'>
      <Grid cols={1} className='lg:grid-cols-[1.2fr_0.8fr]'>
        <Flex direction='column' gap={5} className='relative z-10 p-8 sm:p-10 lg:p-14'>
          <Typography.Small className='tracking-[0.22em] text-white/60 uppercase'>
            {collection.eyebrow || collection.theme_variant || 'Curated collection'}
          </Typography.Small>
          <Typography.H1
            family='display'
            className='max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl'
          >
            {collection.hero_title || collection.title || 'Collection'}
          </Typography.H1>
          {collection.subtitle ? (
            <Typography.Muted className='max-w-xl text-base text-white/70'>
              {collection.subtitle}
            </Typography.Muted>
          ) : null}
          <Typography.Muted className='max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base'>
            {collection.hero_description ||
              collection.description ||
              'Discover a premium edit of products selected for this moment.'}
          </Typography.Muted>
          <Flex direction='row' gap={6} wrap='wrap' className='pt-2 text-xs text-white/60'>
            <span>
              Products:{' '}
              <span className='font-medium text-white'>{productCount.toLocaleString('en-US')}</span>
            </span>
            {collection.mode ? (
              <span>
                Mode: <span className='font-medium text-white capitalize'>{collection.mode}</span>
              </span>
            ) : null}
          </Flex>
        </Flex>

        <div className='relative min-h-[20rem] lg:min-h-full'>
          <AppImage
            src={collection.desktop_image_url || collection.image_url || IMAGE_FALLBACK}
            alt={collection.title || 'Collection'}
            fill
            priority
            sizes='(max-width: 1024px) 100vw, 40vw'
            className='object-cover'
          />
          <div
            className='absolute inset-0 bg-linear-to-l from-transparent via-zinc-950/30 to-zinc-950'
            style={{ opacity: collection.overlay_opacity ?? 0.25 }}
          />
        </div>
      </Grid>
    </section>
  );
}
