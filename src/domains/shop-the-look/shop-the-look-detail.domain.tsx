'use client';

import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { ProductCard } from '@/domains/shop/components/product-card';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import { useGetShopLooksSlug } from '@/services/-shop-looks-{slug}-get';
import type { GetShopLooksSlug200 } from '@/services/-shop-looks-{slug}-get.schemas';

import { ShoppableLookImage } from './components/shoppable-look-image';

type ShopTheLookDetailDomainProps = {
  slug: string;
};

export function ShopTheLookDetailDomain({ slug }: ShopTheLookDetailDomainProps) {
  const t = useTranslations('shopTheLookPage');
  const { data: response, isLoading, isError } = useGetShopLooksSlug(slug, {
    query: { staleTime: 60_000 }
  });

  const payload = response as GetShopLooksSlug200 | undefined;
  const look = payload?.data;

  if (isLoading) {
    return (
      <main className='pb-24'>
        <div className='app-container pt-24'>
          <Skeleton className='h-4 w-48' />
          <Skeleton className='mt-10 aspect-[16/10] w-full rounded-2xl' />
        </div>
      </main>
    );
  }

  if (isError || !look) {
    return (
      <main className='pb-24'>
        <div className='app-container pt-24'>
          <Typography.H2>{t('notFoundTitle')}</Typography.H2>
          <Typography.P className='text-muted-foreground mt-2'>{t('notFoundBody')}</Typography.P>
          <Button asChild className='mt-6'>
            <Link href='/shop-the-look'>{t('backToList')}</Link>
          </Button>
        </div>
      </main>
    );
  }

  const taggedProducts = (look.tags ?? [])
    .map((tag) => tag.product)
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <main className='pb-24'>
      <div className='app-container pt-24'>
        <DynamicBreadcrumb
          items={[
            { label: t('breadcrumb'), href: '/shop-the-look' },
            { label: look.title ?? slug }
          ]}
          direction='column'
          separator={<IconChevronRight className='h-3 w-3' />}
          className='text-muted-foreground text-xs'
          breadcrumbClassName='flex items-center gap-1.5'
          showBackButton={false}
        />

        <Flex direction='column' spacing={4} className='mt-10 max-w-3xl'>
          <Typography.Overline className='text-accent'>{t('eyebrow')}</Typography.Overline>
          <Typography.H1 className='font-display text-4xl font-bold tracking-tight lg:text-5xl'>
            {look.title}
          </Typography.H1>
          {look.description ? (
            <Typography.P className='text-muted-foreground leading-relaxed'>
              {look.description}
            </Typography.P>
          ) : null}
        </Flex>

        <div className='mt-10'>
          <ShoppableLookImage
            look={look}
            hint={t('tapHint')}
            taggedItemsLabel={t('taggedItems', { count: taggedProducts.length })}
            shopLabel={t('shopLabel')}
            closeLabel={t('closeLabel')}
          />
        </div>

        {taggedProducts.length > 0 ? (
          <Flex direction='column' spacing={6} className='mt-16'>
            <Typography.H2 className='text-2xl font-semibold'>{t('shopAllPieces')}</Typography.H2>
            <Grid gap={4} className='grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {taggedProducts.map((product, index) => (
                <ProductCard
                  key={product.id ?? index}
                  product={product as DtoProductWithLike}
                  index={index}
                  size='compact'
                />
              ))}
            </Grid>
          </Flex>
        ) : null}
      </div>
    </main>
  );
}
