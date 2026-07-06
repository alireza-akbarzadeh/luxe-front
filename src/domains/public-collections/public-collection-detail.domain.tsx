'use client';

import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { ProductCard } from '@/domains/shop/components/product-card';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import { useGetPublicCollectionsSlug } from '@/services/-public-collections-{slug}-get';
import type { GetPublicCollectionsSlug200 } from '@/services/-public-collections-{slug}-get.schemas';

type PublicCollectionDetailDomainProps = {
  slug: string;
};

export function PublicCollectionDetailDomain({ slug }: PublicCollectionDetailDomainProps) {
  const t = useTranslations('publicCollectionsPage');
  const {
    data: response,
    isLoading,
    isError
  } = useGetPublicCollectionsSlug(slug, {
    query: { staleTime: 60_000 }
  });

  const payload = response as GetPublicCollectionsSlug200 | undefined;
  const collection = payload?.data;

  if (isLoading) {
    return (
      <main className='pb-24'>
        <div className='app-container pt-24'>
          <Skeleton className='h-4 w-48' />
          <Skeleton className='mt-10 aspect-[21/9] w-full rounded-2xl' />
          <Skeleton className='mt-8 h-32 w-full max-w-xl rounded-2xl' />
        </div>
      </main>
    );
  }

  if (isError || !collection) {
    return (
      <main className='pb-24'>
        <div className='app-container pt-24'>
          <Typography.H2>{t('notFoundTitle')}</Typography.H2>
          <Typography.P className='text-muted-foreground mt-2'>{t('notFoundBody')}</Typography.P>
          <Button asChild className='mt-6'>
            <Link href='/public-collections'>{t('backToList')}</Link>
          </Button>
        </div>
      </main>
    );
  }

  const items = collection.items ?? [];

  return (
    <main className='pb-24'>
      <div className='app-container pt-24'>
        <DynamicBreadcrumb
          items={[
            { label: t('breadcrumb'), href: '/public-collections' },
            { label: collection.title ?? slug }
          ]}
          direction='column'
          separator={<IconChevronRight className='h-3 w-3' />}
          className='text-muted-foreground text-xs'
          breadcrumbClassName='flex items-center gap-1.5'
          showBackButton={false}
        />

        <div className='relative mt-10 overflow-hidden rounded-3xl'>
          <div className='relative aspect-[21/9] min-h-[12rem] w-full'>
            <AppImage
              src={collection.cover_image_url ?? IMAGE_FALLBACK}
              alt=''
              aria-hidden
              fill
              sizes='100vw'
              priority
              className='object-cover'
            />
            <span
              aria-hidden
              className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent'
            />
          </div>

          <Flex direction='column' gap={2} className='absolute inset-x-0 bottom-0 px-6 pb-6'>
            {collection.theme ? (
              <Typography.Overline className='text-gold'>{collection.theme}</Typography.Overline>
            ) : null}
            <Typography.H1 className='font-display text-2xl font-bold text-white sm:text-4xl'>
              {collection.title}
            </Typography.H1>
            {collection.author_name ? (
              <Typography.P className='text-white/80'>
                {t('curatedBy', { name: collection.author_name })}
                {collection.author_handle ? ` · ${collection.author_handle}` : ''}
              </Typography.P>
            ) : null}
          </Flex>
        </div>

        {collection.description ? (
          <Typography.P className='text-muted-foreground mt-8 max-w-3xl text-lg leading-relaxed'>
            {collection.description}
          </Typography.P>
        ) : null}

        {items.length > 0 ? (
          <Flex direction='column' gap={6} className='mt-14'>
            <Typography.H2 className='text-2xl font-semibold'>
              {t('shopCollection', { count: items.length })}
            </Typography.H2>
            <Grid gap={4} className='grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {items.map((item, index) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <Flex key={item.id ?? index} direction='column' gap={2}>
                    <ProductCard
                      product={product as DtoProductWithLike}
                      index={index}
                      size='compact'
                    />
                    {item.note ? (
                      <Typography.Muted className='px-1 text-xs leading-relaxed italic'>
                        “{item.note}”
                      </Typography.Muted>
                    ) : null}
                  </Flex>
                );
              })}
            </Grid>
          </Flex>
        ) : (
          <Typography.P className='text-muted-foreground mt-14'>{t('noItems')}</Typography.P>
        )}
      </div>
    </main>
  );
}
