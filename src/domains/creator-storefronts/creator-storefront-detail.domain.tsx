'use client';

import { IconChevronRight, IconExternalLink } from '@tabler/icons-react';
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
import { useGetCreatorsSlug } from '@/services/-creators-{slug}-get';
import type { GetCreatorsSlug200 } from '@/services/-creators-{slug}-get.schemas';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

type CreatorStorefrontDetailDomainProps = {
  slug: string;
};

export function CreatorStorefrontDetailDomain({ slug }: CreatorStorefrontDetailDomainProps) {
  const t = useTranslations('creatorsPage');
  const {
    data: response,
    isLoading,
    isError
  } = useGetCreatorsSlug(slug, {
    query: { staleTime: 60_000 }
  });

  const payload = response as GetCreatorsSlug200 | undefined;
  const creator = payload?.data;

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

  if (isError || !creator) {
    return (
      <main className='pb-24'>
        <div className='app-container pt-24'>
          <Typography.H2>{t('notFoundTitle')}</Typography.H2>
          <Typography.P className='text-muted-foreground mt-2'>{t('notFoundBody')}</Typography.P>
          <Button asChild className='mt-6'>
            <Link href='/creators'>{t('backToList')}</Link>
          </Button>
        </div>
      </main>
    );
  }

  const picks = creator.picks ?? [];

  return (
    <main className='pb-24'>
      <div className='app-container pt-24'>
        <DynamicBreadcrumb
          items={[
            { label: t('breadcrumb'), href: '/creators' },
            { label: creator.display_name ?? slug }
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
              src={creator.cover_image_url ?? IMAGE_FALLBACK}
              alt=''
              aria-hidden
              fill
              sizes='100vw'
              priority
              className='object-cover'
            />
            <span
              aria-hidden
              className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'
            />
          </div>

          <Flex
            direction='row'
            align='end'
            gap={4}
            className='absolute inset-x-0 bottom-0 px-6 pb-6'
          >
            <div className='border-background relative size-20 shrink-0 overflow-hidden rounded-full border-4 shadow-xl sm:size-24'>
              <AppImage
                src={creator.avatar_url ?? IMAGE_FALLBACK}
                alt={creator.display_name ?? ''}
                fill
                sizes='96px'
                className='object-cover'
              />
            </div>
            <Flex direction='column' gap={1} className='min-w-0 flex-1 pb-1'>
              <Typography.H1 className='font-display text-2xl font-bold text-white sm:text-4xl'>
                {creator.display_name}
              </Typography.H1>
              {creator.handle ? (
                <Typography.P className='text-white/80'>{creator.handle}</Typography.P>
              ) : null}
            </Flex>
            {creator.instagram_url ? (
              <Button
                asChild
                variant='secondary'
                size='sm'
                className='hidden shrink-0 rounded-full sm:inline-flex'
              >
                <a href={creator.instagram_url} target='_blank' rel='noopener noreferrer'>
                  {t('follow')}
                  <IconExternalLink className='ms-2 size-4' />
                </a>
              </Button>
            ) : null}
          </Flex>
        </div>

        <Flex direction='column' gap={3} className='mt-8 max-w-3xl'>
          {creator.specialty ? (
            <Typography.Overline className='text-gold'>{creator.specialty}</Typography.Overline>
          ) : null}
          {creator.bio ? (
            <Typography.P className='text-muted-foreground text-lg leading-relaxed'>
              {creator.bio}
            </Typography.P>
          ) : null}
        </Flex>

        {picks.length > 0 ? (
          <Flex direction='column' gap={6} className='mt-14'>
            <Typography.H2 className='text-2xl font-semibold'>{t('curatedEdit')}</Typography.H2>
            <Grid gap={4} className='grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {picks.map((pick, index) => {
                const product = pick.product;
                if (!product) return null;

                return (
                  <Flex key={pick.id ?? index} direction='column' gap={2}>
                    <ProductCard
                      product={product as DtoProductWithLike}
                      index={index}
                      size='compact'
                    />
                    {pick.headline ? (
                      <Typography.Muted className='px-1 text-xs leading-relaxed italic'>
                        “{pick.headline}”
                      </Typography.Muted>
                    ) : null}
                  </Flex>
                );
              })}
            </Grid>
          </Flex>
        ) : (
          <Typography.P className='text-muted-foreground mt-14'>{t('noPicks')}</Typography.P>
        )}
      </div>
    </main>
  );
}
