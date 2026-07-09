'use client';

import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/typography';
import {
  COLLECTION_CATEGORY_NONE,
  COLLECTION_PREVIEW_SORT_NONE
} from '@/domains/collections-admin/collection.schema';
import { IMAGE_FALLBACK } from '@/lib/images';
import { useGetProducts } from '@/services/-products-get';
import type { GetProductsSort } from '@/services/-products-get.schemas';

interface CollectionRulesPreviewProps {
  previewSort?: string;
  previewCategoryId?: string;
  previewIsNew?: boolean;
}

function mapPreviewSort(sort?: string): GetProductsSort | undefined {
  if (!sort || sort === COLLECTION_PREVIEW_SORT_NONE) return undefined;
  const allowed: GetProductsSort[] = [
    'newest',
    'rating_desc',
    'reviews_desc',
    'price_asc',
    'price_desc'
  ];
  return allowed.includes(sort as GetProductsSort) ? (sort as GetProductsSort) : undefined;
}

/** Live preview of smart collection product rules on the admin form. */
export function CollectionRulesPreview({
  previewSort,
  previewCategoryId,
  previewIsNew
}: CollectionRulesPreviewProps) {
  const categoryId =
    previewCategoryId && previewCategoryId !== COLLECTION_CATEGORY_NONE
      ? Number(previewCategoryId)
      : undefined;

  const { data, isLoading } = useGetProducts(
    {
      limit: 4,
      offset: 0,
      category_id: categoryId,
      is_new: previewIsNew || undefined,
      sort: mapPreviewSort(previewSort)
    },
    { query: { staleTime: 30_000 } }
  );

  const products = data?.data?.products ?? [];
  const total = data?.data?.total ?? 0;

  const ruleLabels: string[] = [];
  if (previewIsNew) ruleLabels.push('New only');
  if (categoryId) ruleLabels.push(`Category #${categoryId}`);
  if (previewSort && previewSort !== COLLECTION_PREVIEW_SORT_NONE) {
    ruleLabels.push(`Sort: ${previewSort}`);
  }
  if (ruleLabels.length === 0) ruleLabels.push('No filters — all products');

  return (
    <Card className='border-dashed'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Rules preview</CardTitle>
        <CardDescription>
          Sample products matching the smart rules below ({total.toLocaleString()} total).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Flex direction='row' wrap='wrap' spacing={2} className='mb-4'>
          {ruleLabels.map((label) => (
            <Badge key={label} variant='outline' className='text-[10px]'>
              {label}
            </Badge>
          ))}
        </Flex>

        {isLoading ? (
          <Flex direction='row' spacing={3} className='overflow-x-auto'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className='size-20 shrink-0 rounded-lg' />
            ))}
          </Flex>
        ) : products.length === 0 ? (
          <Text variant='muted' className='text-sm'>
            No products match these rules yet.
          </Text>
        ) : (
          <Flex direction='row' spacing={3} className='overflow-x-auto pb-1'>
            {products.map((product) => (
              <Flex key={product.id} direction='column' spacing={1} className='w-24 shrink-0'>
                <Flex
                  align='center'
                  justify='center'
                  className='bg-muted relative size-20 overflow-hidden rounded-lg border'
                >
                  <AppImage
                    src={product.images?.[0] ?? IMAGE_FALLBACK}
                    alt={product.name ?? ''}
                    fill
                    sizes='80px'
                    className='object-cover'
                  />
                </Flex>
                <Text variant='muted' className='line-clamp-2 text-[10px] leading-tight'>
                  {product.name ?? '—'}
                </Text>
              </Flex>
            ))}
          </Flex>
        )}
      </CardContent>
    </Card>
  );
}
