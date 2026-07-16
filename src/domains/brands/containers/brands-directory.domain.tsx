'use client';

import { IconRefresh } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { BrandDirectoryCard } from '@/domains/brands/components/brand-directory-card';
import { BrandsBreadcrumb, BrandsPageHeader } from '@/domains/brands/components/brands-page-header';
import { useBrandsDirectoryFilters } from '@/domains/brands/hooks/use-brands-directory-filters';
import { BrandRequestCta, BrandsTrustStripe } from '@/domains/brands/sections/brands-directory-cta';
import { BrandsDirectoryToolbar } from '@/domains/brands/sections/brands-directory-toolbar';
import { toBrandDirectoryCard } from '@/domains/brands/types/brands.types';
import { useGetBrands } from '@/services/-brands-get';

/** Storefront brands directory — search, tabs, grid, CTA. */
export function BrandsDirectoryDomain() {
  const { search, tab, limit, setSearch, setTab, loadMore, apiParams } =
    useBrandsDirectoryFilters();

  const { data, isLoading, isError, refetch, isFetching } = useGetBrands(apiParams);

  const brands = (data?.data?.brands ?? [])
    .map(toBrandDirectoryCard)
    .filter((b): b is NonNullable<typeof b> => b != null);

  const total = data?.data?.total ?? 0;
  const showingFrom = brands.length === 0 ? 0 : 1;
  const showingTo = brands.length;
  const hasMore = brands.length < total;

  return (
    <main className='app-container pb-16 sm:pb-20'>
      <BrandsBreadcrumb items={[{ label: 'Brands' }]} />

      <Flex direction='column' gap={8} className='pt-2'>
        <BrandsPageHeader
          title='Brands'
          subtitle={`Discover and shop from ${Math.max(total, 1).toLocaleString('en-US')}+ premium brands`}
        />

        <BrandsDirectoryToolbar
          search={search}
          tab={tab}
          showingFrom={showingFrom}
          showingTo={showingTo}
          total={total}
          onSearchChange={setSearch}
          onTabChange={setTab}
        />

        {isError ? (
          <Flex
            direction='column'
            align='center'
            gap={4}
            className='border-border bg-muted/20 rounded-2xl border py-16'
          >
            <Typography.Muted>Could not load brands. Please try again.</Typography.Muted>
            <Button variant='outline' className='gap-2 rounded-full' onClick={() => void refetch()}>
              <IconRefresh className='h-4 w-4' />
              Retry
            </Button>
          </Flex>
        ) : isLoading && brands.length === 0 ? (
          <Grid cols={2} gap={4} className='md:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='bg-muted/40 h-52 animate-pulse rounded-2xl' />
            ))}
          </Grid>
        ) : brands.length === 0 ? (
          <Flex
            direction='column'
            align='center'
            gap={2}
            className='border-border rounded-2xl border py-16 text-center'
          >
            <Typography.H3 className='text-lg font-semibold'>No brands found</Typography.H3>
            <Typography.Muted className='text-sm'>
              Try a different search or filter tab.
            </Typography.Muted>
          </Flex>
        ) : (
          <Flex direction='column' gap={8}>
            <Grid cols={2} gap={4} className='md:grid-cols-3 xl:grid-cols-4'>
              {brands.map((brand) => (
                <BrandDirectoryCard key={brand.id} brand={brand} />
              ))}
            </Grid>

            {hasMore ? (
              <Flex justify='center'>
                <Button
                  type='button'
                  variant='outline'
                  className='rounded-full px-8'
                  disabled={isFetching}
                  onClick={loadMore}
                >
                  {isFetching && limit > showingTo ? 'Loading…' : 'Load more brands'}
                </Button>
              </Flex>
            ) : null}
          </Flex>
        )}

        <BrandRequestCta />
        <BrandsTrustStripe />
      </Flex>
    </main>
  );
}
