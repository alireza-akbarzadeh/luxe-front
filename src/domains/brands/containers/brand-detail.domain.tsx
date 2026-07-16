'use client';

import { IconRefresh } from '@tabler/icons-react';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { BrandsBreadcrumb } from '@/domains/brands/components/brands-page-header';
import {
  BRAND_PRODUCTS_PAGE_SIZE,
  useBrandProductFilters
} from '@/domains/brands/hooks/use-brand-product-filters';
import { BrandDetailHero } from '@/domains/brands/sections/brand-detail-hero';
import { BrandProductsPagination } from '@/domains/brands/sections/brand-products-pagination';
import { BrandProductsSidebar } from '@/domains/brands/sections/brand-products-sidebar';
import { BrandProductsToolbar } from '@/domains/brands/sections/brand-products-toolbar';
import { ProductCard } from '@/domains/shop/components/product-card';
import { useGetBrandsSlugSlug } from '@/services/-brands-slug-{slug}-get';
import { useGetCategories } from '@/services/-categories-get';
import { useGetProducts } from '@/services/-products-get';

interface BrandDetailDomainProps {
  slug: string;
}

/** Storefront brand detail — hero, filters, product grid, pagination. */
export function BrandDetailDomain({ slug }: BrandDetailDomainProps) {
  const {
    data: brandResponse,
    isLoading: brandLoading,
    isError: brandError,
    isFetched,
    refetch: refetchBrand
  } = useGetBrandsSlugSlug(slug);

  const brand = brandResponse?.data;
  const filters = useBrandProductFilters(brand?.id ?? 0);
  const { data: categoriesData } = useGetCategories({ limit: 40, is_active: true });
  const {
    data: productsResponse,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
    isFetching
  } = useGetProducts(filters.catalogParams, { query: { enabled: Boolean(brand?.id) } });

  const products = productsResponse?.data?.products ?? [];
  const totalProducts = productsResponse?.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalProducts / BRAND_PRODUCTS_PAGE_SIZE));
  const categories = categoriesData?.data?.categories ?? [];

  if (brandLoading) {
    return (
      <main className='app-container py-10'>
        <div className='bg-muted/40 h-64 animate-pulse rounded-[1.75rem]' />
      </main>
    );
  }

  if (brandError) {
    return (
      <main className='app-container py-16'>
        <Flex direction='column' align='center' gap={4}>
          <Typography.Muted>Could not load this brand.</Typography.Muted>
          <Button
            variant='outline'
            className='gap-2 rounded-full'
            onClick={() => void refetchBrand()}
          >
            <IconRefresh className='h-4 w-4' />
            Retry
          </Button>
        </Flex>
      </main>
    );
  }

  if (isFetched && (!brand?.id || !brand.slug)) {
    notFound();
  }

  if (!brand?.id || !brand.slug) {
    return null;
  }

  return (
    <main className='app-container pb-16 sm:pb-20'>
      <BrandsBreadcrumb
        items={[{ label: 'Brands', href: '/brands' }, { label: brand.name ?? 'Brand' }]}
      />

      <Flex direction='column' gap={10} className='pt-2'>
        <BrandDetailHero brand={brand} productCount={brand.product_count ?? totalProducts} />

        <BrandProductsToolbar
          totalProducts={totalProducts}
          isFetching={isFetching}
          sortBy={filters.sortBy}
          onSortChange={filters.setSortBy}
        />

        <Grid cols={1} gap={8} className='lg:grid-cols-[240px_1fr]'>
          <BrandProductsSidebar
            categories={categories}
            categoryId={filters.categoryId}
            priceMin={filters.priceMin}
            priceMax={filters.priceMax}
            gender={filters.gender}
            hasActiveFilters={filters.hasActiveFilters}
            onCategoryChange={filters.setCategoryId}
            onPriceChange={filters.setPriceRange}
            onGenderChange={filters.setGender}
            onClear={filters.clearFilters}
            className='hidden lg:block'
          />

          <Flex direction='column' gap={6} className='min-w-0'>
            {productsError ? (
              <Flex direction='column' align='center' gap={4} className='py-16'>
                <Typography.Muted>Could not load products.</Typography.Muted>
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
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className='bg-muted/40 h-80 animate-pulse rounded-2xl' />
                ))}
              </Grid>
            ) : products.length === 0 ? (
              <Flex
                direction='column'
                align='center'
                gap={2}
                className='border-border rounded-2xl border py-16 text-center'
              >
                <Typography.H3 className='text-lg font-semibold'>No products yet</Typography.H3>
                <Typography.Muted className='text-sm'>
                  Try clearing filters or check back soon.
                </Typography.Muted>
                {filters.hasActiveFilters ? (
                  <Button
                    variant='outline'
                    className='mt-2 rounded-full'
                    onClick={filters.clearFilters}
                  >
                    Clear filters
                  </Button>
                ) : null}
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
                <BrandProductsPagination
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
