'use client';

import { IconRefresh } from '@tabler/icons-react';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import {
  COLLECTION_PRODUCTS_PAGE_SIZE,
  useCollectionProductFilters
} from '@/domains/collections/hooks/use-collection-product-filters';
import { CollectionDetailHero } from '@/domains/collections/sections/collection-detail-hero';
import { CollectionProductsPagination } from '@/domains/collections/sections/collection-products-pagination';
import { CollectionProductsToolbar } from '@/domains/collections/sections/collection-products-toolbar';
import { ProductCard } from '@/domains/shop/components/product-card';
import { useGetCategories } from '@/services/-categories-get';
import { useGetCollectionsSlugSlug } from '@/services/-collections-slug-{slug}-get';
import { useGetCollectionsSlugSlugProducts } from '@/services/-collections-slug-{slug}-products-get';

interface CollectionDetailDomainProps {
  slug: string;
}

/** Storefront collection detail page — hero plus resolved product grid. */
export function CollectionDetailDomain({ slug }: CollectionDetailDomainProps) {
  const {
    data: collectionResponse,
    isLoading: collectionLoading,
    isError: collectionError,
    isFetched,
    refetch: refetchCollection
  } = useGetCollectionsSlugSlug(slug);
  const collection = collectionResponse?.data;

  const filters = useCollectionProductFilters();
  const { data: categoriesData } = useGetCategories({ limit: 40, is_active: true });
  const {
    data: productsResponse,
    isLoading: productsLoading,
    isError: productsError,
    isFetching,
    refetch: refetchProducts
  } = useGetCollectionsSlugSlugProducts(slug, filters.apiParams, {
    query: { enabled: Boolean(collection?.slug) }
  });

  const products = productsResponse?.data?.products ?? [];
  const totalProducts = productsResponse?.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalProducts / COLLECTION_PRODUCTS_PAGE_SIZE));
  const categories = categoriesData?.data?.categories ?? [];

  if (collectionLoading) {
    return (
      <main className='app-container py-10'>
        <div className='bg-muted/40 h-64 animate-pulse rounded-[1.75rem]' />
      </main>
    );
  }

  if (collectionError) {
    return (
      <main className='app-container py-16'>
        <Flex direction='column' align='center' gap={4}>
          <Typography.Muted>Could not load this collection.</Typography.Muted>
          <Button
            variant='outline'
            className='gap-2 rounded-full'
            onClick={() => void refetchCollection()}
          >
            <IconRefresh className='h-4 w-4' />
            Retry
          </Button>
        </Flex>
      </main>
    );
  }

  if (isFetched && !collection?.slug) {
    notFound();
  }

  if (!collection?.slug) {
    return null;
  }

  return (
    <main className='app-container pb-16 sm:pb-20'>
      <Flex direction='column' gap={10} className='pt-6'>
        <CollectionDetailHero collection={collection} productCount={totalProducts} />

        <CollectionProductsToolbar
          totalProducts={totalProducts}
          isFetching={isFetching}
          sortBy={filters.sortBy}
          onSortChange={filters.setSortBy}
        />

        <Grid cols={1} gap={8} className='lg:grid-cols-[240px_1fr]'>
          <Flex direction='column' gap={3} className='hidden rounded-2xl border p-5 lg:flex'>
            <Typography.H3 className='text-lg'>Refine</Typography.H3>
            <Typography.Muted className='text-sm'>
              Use the category shortcuts to tighten this edit.
            </Typography.Muted>
            <div className='flex flex-wrap gap-2'>
              <Button
                type='button'
                variant={filters.categoryId === 0 ? 'default' : 'outline'}
                className='rounded-full'
                onClick={() => filters.setCategoryId(0)}
              >
                All
              </Button>
              {categories.slice(0, 8).map((category) => (
                <Button
                  key={category.id}
                  type='button'
                  variant={filters.categoryId === category.id ? 'default' : 'outline'}
                  className='rounded-full'
                  onClick={() => filters.setCategoryId(Number(category.id))}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </Flex>

          <Flex direction='column' gap={6} className='min-w-0'>
            {productsError ? (
              <Flex direction='column' align='center' gap={4} className='py-16'>
                <Typography.Muted>Could not load collection products.</Typography.Muted>
                <Button
                  variant='outline'
                  className='gap-2 rounded-full'
                  onClick={() => void refetchProducts()}
                >
                  <IconRefresh className='h-4 w-4' />
                  Retry
                </Button>
              </Flex>
            ) : productsLoading && products.length === 0 ? (
              <Grid cols={1} gap={5} className='sm:grid-cols-2 xl:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className='bg-muted/40 h-80 animate-pulse rounded-2xl' />
                ))}
              </Grid>
            ) : products.length === 0 ? (
              <Flex
                direction='column'
                align='center'
                gap={3}
                className='rounded-2xl border py-16 text-center'
              >
                <Typography.H3 className='text-lg'>No products found</Typography.H3>
                <Typography.Muted className='text-sm'>
                  Try another category or revisit the collection rules in admin.
                </Typography.Muted>
              </Flex>
            ) : (
              <>
                <Grid cols={1} gap={5} className='sm:grid-cols-2 xl:grid-cols-3'>
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id ?? product.slug ?? index}
                      product={product}
                      index={index}
                      priority={index < 3}
                    />
                  ))}
                </Grid>
                <CollectionProductsPagination
                  page={filters.page}
                  totalPages={totalPages}
                  onPageChange={filters.setPage}
                />
              </>
            )}
          </Flex>
        </Grid>
      </Flex>
    </main>
  );
}
