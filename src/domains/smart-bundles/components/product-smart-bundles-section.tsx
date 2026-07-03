'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { useGetProductsIdSmartBundles } from '@/services/-products-{id}-smart-bundles-get';

import { SmartBundleCard } from './smart-bundle-card';

const INTENTS = ['everyday', 'workspace', 'travel', 'gift'] as const;
type BundleIntent = (typeof INTENTS)[number];

type ProductSmartBundlesSectionProps = {
  productId: number;
};

/** PDP section — intent-aware smart bundles for the current product. */
export function ProductSmartBundlesSection({ productId }: ProductSmartBundlesSectionProps) {
  const t = useTranslations('pdp.smartBundles');
  const [intent, setIntent] = useState<BundleIntent>('everyday');

  const { data, isLoading } = useGetProductsIdSmartBundles(
    productId,
    { intent, limit: 3 },
    { query: { enabled: productId > 0, staleTime: 60_000 } }
  );

  const bundles = data?.data?.bundles ?? [];

  if (!isLoading && bundles.length === 0) {
    return null;
  }

  return (
    <section className='mt-16 border-t pt-12'>
      <Flex direction='column' spacing={2} className='mb-8 max-w-2xl'>
        <Typography.H2 family='display' className='text-2xl font-semibold tracking-tight md:text-3xl'>
          {t('title')}
        </Typography.H2>
        <Typography.Muted className='text-sm leading-relaxed'>{t('description')}</Typography.Muted>
      </Flex>

      <Flex wrap='wrap' spacing={2} className='mb-6'>
        {INTENTS.map((value) => (
          <Button
            key={value}
            type='button'
            size='sm'
            variant={intent === value ? 'default' : 'outline'}
            className='rounded-full'
            onClick={() => setIntent(value)}
          >
            {t(`intents.${value}`)}
          </Button>
        ))}
      </Flex>

      {isLoading ? (
        <div className='grid gap-4 lg:grid-cols-2'>
          <Skeleton className='h-80 rounded-2xl' />
          <Skeleton className='h-80 rounded-2xl' />
        </div>
      ) : (
        <div className={cn('grid gap-4', bundles.length > 1 && 'lg:grid-cols-2')}>
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
    </section>
  );
}
