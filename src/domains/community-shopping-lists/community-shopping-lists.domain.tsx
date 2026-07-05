'use client';

import { IconChevronRight } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { useGetCommunityLists } from '@/services/-community-lists-get';
import type { GetCommunityLists200 } from '@/services/-community-lists-get.schemas';

import { ShoppingListCard } from './components/shopping-list-card';

export function CommunityShoppingListsDomain() {
  const t = useTranslations('communityListsPage');
  const { data: listResponse, isLoading } = useGetCommunityLists(
    { limit: 12 },
    { query: { staleTime: 60_000 } }
  );

  const listData = listResponse as GetCommunityLists200 | undefined;
  const lists = listData?.data?.lists ?? [];
  const showSkeleton = isLoading && lists.length === 0;

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
          <Typography.Overline className='text-gold'>{t('eyebrow')}</Typography.Overline>
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
              <Skeleton key={index} className='aspect-[16/10] w-full rounded-2xl' />
            ))}
          </Grid>
        ) : lists.length > 0 ? (
          <Grid gap={6} className='mt-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {lists.map((list, index) => (
              <ShoppingListCard
                key={list.id ?? index}
                list={list}
                viewLabel={t('viewLabel')}
                itemsLabel={t('itemCount', { count: list.item_count ?? 0 })}
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
