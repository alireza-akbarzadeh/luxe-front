'use client';

import { IconChevronRight } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { useGetShopLooks } from '@/services/-shop-looks-get';
import type { GetShopLooks200 } from '@/services/-shop-looks-get.schemas';

import { ShopLookCard } from './components/shop-look-card';

export function ShopTheLookDomain() {
  const t = useTranslations('shopTheLookPage');
  const { data: listResponse, isLoading } = useGetShopLooks(
    { limit: 12 },
    { query: { staleTime: 60_000 } }
  );

  const listData = listResponse as GetShopLooks200 | undefined;
  const looks = listData?.data?.looks ?? [];
  const showSkeleton = isLoading && looks.length === 0;

  return (
    <main className='pb-24'>
      <div className='app-container pt-24'>
        <DynamicBreadcrumb
          items={[{ label: t('breadcrumb') }]}
          direction='column'
          separator={<IconChevronRight className='h-3 w-3' />}
          className='text-muted-foreground text-xs'
          breadcrumbClassName='flex items-center gap-1.5'
          showBackButton={false}
        />

        <div className='mt-10 max-w-3xl'>
          <Typography.Overline className='text-accent'>{t('eyebrow')}</Typography.Overline>
          <Typography.H1 className='font-display mt-3 text-4xl font-bold tracking-tight lg:text-5xl'>
            {t('title')}
          </Typography.H1>
          <Typography.P className='text-muted-foreground mt-4 leading-relaxed'>
            {t('description')}
          </Typography.P>
        </div>

        {showSkeleton ? (
          <Grid gap={6} className='mt-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className='aspect-[4/5] w-full rounded-2xl' />
            ))}
          </Grid>
        ) : looks.length > 0 ? (
          <Grid gap={6} className='mt-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {looks.map((look, index) => (
              <ShopLookCard
                key={look.id ?? index}
                look={look}
                eyebrow={t('eyebrow')}
                shopLabel={t('shopLabel')}
                piecesLabel={t('shoppablePieces', { count: look.tag_count ?? 0 })}
              />
            ))}
          </Grid>
        ) : (
          <Typography.P className='text-muted-foreground mt-12'>{t('empty')}</Typography.P>
        )}
      </div>
    </main>
  );
}
