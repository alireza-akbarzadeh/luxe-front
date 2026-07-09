'use client';

import { IconExternalLink } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/typography';
import { formatCurrency } from '@/lib/format';
import { useGetHomeTopBrands } from '@/services/-home-top-brands-get';
import { useGetProducts } from '@/services/-products-get';

interface BrandStatsPanelProps {
  brandId: number;
  productCount?: number;
  isFeatured?: boolean;
}

/** Brand edit sidebar stats — catalog size and homepage placement signals. */
export function BrandStatsPanel({ brandId, productCount, isFeatured }: BrandStatsPanelProps) {
  const { data: productsData, isLoading: isLoadingCount } = useGetProducts(
    { brand_id: brandId, limit: 1, offset: 0 },
    { query: { staleTime: 60_000, enabled: productCount == null } }
  );

  const { data: topBrandsData, isLoading: isLoadingTop } = useGetHomeTopBrands(
    { limit: 50 },
    { query: { staleTime: 5 * 60_000 } }
  );

  const productTotal = productCount ?? productsData?.data?.total ?? 0;
  const topBrand = topBrandsData?.data?.brands?.find((item) => item.id === brandId);

  return (
    <Card className='mb-6'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Brand insights</CardTitle>
        <CardDescription>Catalog size and storefront performance signals.</CardDescription>
      </CardHeader>
      <CardContent>
        <Grid cols={2} gap={4} className='sm:grid-cols-4'>
          <GridItem>
            <Flex direction='column' spacing={0.5}>
              <Text variant='muted' className='text-[10px] font-bold uppercase'>
                Products
              </Text>
              {isLoadingCount ? (
                <Skeleton className='h-6 w-12' />
              ) : (
                <Text variant='small' className='text-lg font-semibold tabular-nums'>
                  {productTotal.toLocaleString()}
                </Text>
              )}
            </Flex>
          </GridItem>

          {topBrand ? (
            <>
              <GridItem>
                <Flex direction='column' spacing={0.5}>
                  <Text variant='muted' className='text-[10px] font-bold uppercase'>
                    Units sold
                  </Text>
                  <Text variant='small' className='text-lg font-semibold tabular-nums'>
                    {(topBrand.units_sold ?? 0).toLocaleString()}
                  </Text>
                </Flex>
              </GridItem>
              <GridItem>
                <Flex direction='column' spacing={0.5}>
                  <Text variant='muted' className='text-[10px] font-bold uppercase'>
                    Revenue
                  </Text>
                  <Text variant='small' className='text-lg font-semibold tabular-nums'>
                    {formatCurrency(topBrand.revenue ?? 0)}
                  </Text>
                </Flex>
              </GridItem>
              <GridItem>
                <Flex direction='column' spacing={0.5}>
                  <Text variant='muted' className='text-[10px] font-bold uppercase'>
                    Homepage
                  </Text>
                  <Text variant='small' className='text-sm font-medium text-emerald-600'>
                    Top brand
                  </Text>
                </Flex>
              </GridItem>
            </>
          ) : isLoadingTop ? (
            <GridItem className='col-span-3'>
              <Skeleton className='h-6 w-full' />
            </GridItem>
          ) : (
            <GridItem className='col-span-3'>
              <Text variant='muted' className='text-xs'>
                {isFeatured
                  ? 'Pinned as a featured brand on the homepage.'
                  : 'Not in current homepage top brands — ranking is sales-based.'}
              </Text>
            </GridItem>
          )}
        </Grid>

        <Button variant='outline' size='sm' className='mt-4' asChild>
          <Link href={`/dashboard/products?brand_id=${brandId}`}>
            <IconExternalLink className='size-4' />
            View products
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
