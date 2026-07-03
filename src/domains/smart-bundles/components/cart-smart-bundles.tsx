'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';

import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { useCartController } from '@/hooks/useCartController';
import { usePostBundlesSuggest } from '@/services/-bundles-suggest-post';

import { SmartBundleCard } from './smart-bundle-card';

/** Cart upsell — smart bundles based on items already in the cart. */
export function CartSmartBundles() {
  const t = useTranslations('cart.smartBundles');
  const { items } = useCartController();

  const productIdsKey = useMemo(() => {
    const ids = items
      .map((item) => item.product_id)
      .filter((id): id is number => id !== undefined && id !== null)
      .sort((a, b) => a - b);
    return ids.join(',');
  }, [items]);

  const { mutate, data, isPending, reset } = usePostBundlesSuggest();

  useEffect(() => {
    if (!productIdsKey) {
      reset();
      return;
    }
    const productIds = productIdsKey.split(',').map(Number);
    mutate({ data: { product_ids: productIds, intent: 'everyday', limit: 2 } });
  }, [productIdsKey, mutate, reset]);

  const bundles = data?.data?.bundles ?? [];

  if (!isPending && bundles.length === 0) {
    return null;
  }

  return (
    <div className='mt-12 border-t pt-10'>
      <Flex direction='column' spacing={1} className='mb-6'>
        <Typography.Overline className='text-accent'>{t('eyebrow')}</Typography.Overline>
        <Typography.H3 family='display' className='text-xl font-semibold'>
          {t('title')}
        </Typography.H3>
        <Typography.Muted className='text-sm'>{t('description')}</Typography.Muted>
      </Flex>

      {isPending ? (
        <div className='grid gap-4 lg:grid-cols-2'>
          <Skeleton className='h-72 rounded-2xl' />
        </div>
      ) : (
        <div className='grid gap-4 lg:grid-cols-2'>
          {bundles.map((bundle) => (
            <SmartBundleCard
              key={bundle.id}
              bundle={bundle}
              addAllLabel={t('addAll')}
              compatibilityLabel={t('compatibility', { score: bundle.compatibility_score ?? 0 })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
