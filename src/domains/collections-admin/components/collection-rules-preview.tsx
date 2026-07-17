'use client';

import { useQuery } from '@tanstack/react-query';
import { useDeferredValue, useMemo } from 'react';

import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/typography';
import type { CollectionRulesForm } from '@/domains/collections-admin/collection.schema';
import { mapFormRulesToDto } from '@/domains/collections-admin/lib/collection-mapper';
import { IMAGE_FALLBACK } from '@/lib/images';
import { postCollectionsIdValidateRules } from '@/services/-collections-{id}-validate-rules-post';
import { postCollectionsValidateRules } from '@/services/-collections-validate-rules-post';

interface CollectionRulesPreviewProps {
  mode: 'manual' | 'dynamic' | 'hybrid';
  rules: CollectionRulesForm;
  collectionId?: number;
}

/** Live preview of collection rules via validate-rules (same resolver as storefront). */
export function CollectionRulesPreview({ mode, rules, collectionId }: CollectionRulesPreviewProps) {
  const deferredRules = useDeferredValue(rules);
  const dtoRules = useMemo(() => mapFormRulesToDto(deferredRules), [deferredRules]);
  const canPreview = mode !== 'manual' && Boolean(dtoRules);

  const previewQuery = useQuery({
    queryKey: ['collection-rules-preview', mode, collectionId, dtoRules],
    queryFn: async () => {
      const body = { mode, rules: dtoRules!, limit: 4 };
      if (collectionId) {
        return postCollectionsIdValidateRules(collectionId, body);
      }
      return postCollectionsValidateRules(body);
    },
    enabled: canPreview,
    staleTime: 15_000
  });

  const products = previewQuery.data?.data?.products ?? [];
  const total = previewQuery.data?.data?.total ?? 0;
  const errorMessage =
    !canPreview && mode !== 'manual'
      ? 'Add at least one condition to preview'
      : previewQuery.isError
        ? previewQuery.error instanceof Error
          ? previewQuery.error.message
          : 'Failed to validate rules'
        : null;

  if (mode === 'manual') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Rules preview</CardTitle>
          <CardDescription>Manual collections resolve from curated product picks.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Flex direction='row' align='center' justify='between' className='gap-2'>
          <div>
            <CardTitle className='text-base'>Rules preview</CardTitle>
            <CardDescription>Resolved with the same API path as the storefront.</CardDescription>
          </div>
          {canPreview && !previewQuery.isFetching && !errorMessage ? (
            <Badge variant='secondary'>{total.toLocaleString()} matches</Badge>
          ) : null}
        </Flex>
      </CardHeader>
      <CardContent>
        {previewQuery.isFetching ? (
          <Flex direction='row' spacing={3} className='flex-wrap'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className='h-20 w-20 rounded-lg' />
            ))}
          </Flex>
        ) : errorMessage ? (
          <Text variant='muted' className='text-destructive text-sm'>
            {errorMessage}
          </Text>
        ) : products.length === 0 ? (
          <Text variant='muted' className='text-sm'>
            No products matched these rules.
          </Text>
        ) : (
          <Flex direction='row' spacing={3} className='flex-wrap'>
            {products.map((product) => (
              <Flex key={product.id} direction='column' spacing={1} className='w-20'>
                <div className='relative h-20 w-20 overflow-hidden rounded-lg border'>
                  <AppImage
                    src={product.images?.[0] ?? IMAGE_FALLBACK}
                    alt={product.name ?? 'Product'}
                    fill
                    sizes='80px'
                    className='object-cover'
                  />
                </div>
                <Text className='line-clamp-2 text-[10px]'>{product.name}</Text>
              </Flex>
            ))}
          </Flex>
        )}
      </CardContent>
    </Card>
  );
}
