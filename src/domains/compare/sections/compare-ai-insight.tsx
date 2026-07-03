'use client';

import {
  IconAlertTriangle,
  IconScale,
  IconSparkles,
  IconThumbUp
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useCompareAiInsight } from '@/domains/compare/hooks/use-compare-ai-insight';
import type { DtoAiCompareBestFor, DtoAiCompareInsightResponse } from '@/services/-ai-compare-insight-post.schemas';

interface CompareAiInsightProps {
  productIds: number[];
}

export function CompareAiInsight({ productIds }: CompareAiInsightProps) {
  const t = useTranslations('comparePage.ai');
  const { fetchInsight, isPending, offlineMessage, cacheKey } = useCompareAiInsight(productIds);
  const [insight, setInsight] = useState<DtoAiCompareInsightResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productIds.length < 2) {
      setInsight(null);
      setError(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setError(null);
      setInsight(null);
      const result = await fetchInsight();
      if (cancelled) {
        return;
      }
      if (!result) {
        setError(offlineMessage);
        return;
      }
      setInsight(result);
    };

    void load();

    return () => {
      cancelled = true;
    };
    // Refetch when compared product set changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cacheKey tracks productIds
  }, [cacheKey]);

  if (productIds.length < 2) {
    return null;
  }

  return (
    <section className='mt-10'>
      <Flex direction='row' align='center' spacing={2} className='mb-5'>
        <IconSparkles className='text-accent h-5 w-5' />
        <Typography.H2 className='text-xl font-semibold tracking-tight'>
          {t('title')}
        </Typography.H2>
      </Flex>

      <Card className='border-border/70 rounded-2xl border p-6'>
        {isPending ? (
          <Flex direction='column' spacing={3} align='center' className='py-8'>
            <IconSparkles className='text-accent size-6 animate-pulse' />
            <Typography.Muted className='text-sm'>{t('loading')}</Typography.Muted>
          </Flex>
        ) : error ? (
          <Flex direction='column' spacing={3} align='center' className='py-8 text-center'>
            <IconAlertTriangle className='text-muted-foreground size-6' />
            <Typography.Text variant='small' className='text-muted-foreground max-w-md'>
              {error}
            </Typography.Text>
          </Flex>
        ) : insight ? (
          <Flex direction='column' spacing={6}>
            {insight.summary ? (
              <Flex direction='column' spacing={2}>
                <Typography.Text className='font-medium'>{t('summary')}</Typography.Text>
                <Typography.Text className='text-muted-foreground text-sm leading-relaxed'>
                  {insight.summary}
                </Typography.Text>
              </Flex>
            ) : null}

            {insight.recommendation ? (
              <Flex
                direction='column'
                spacing={2}
                className='bg-accent/5 border-accent/20 rounded-xl border p-4'
              >
                <Flex direction='row' align='center' spacing={2}>
                  <IconThumbUp className='text-accent size-4' />
                  <Typography.Text className='font-medium'>{t('recommendation')}</Typography.Text>
                </Flex>
                <Typography.Text className='text-sm leading-relaxed'>
                  {insight.recommendation}
                </Typography.Text>
              </Flex>
            ) : null}

            {insight.best_for && insight.best_for.length > 0 ? (
              <Flex direction='column' spacing={3}>
                <Typography.Text className='font-medium'>{t('bestFor')}</Typography.Text>
                <Flex direction='column' spacing={3}>
                  {insight.best_for.map((item: DtoAiCompareBestFor) => (
                    <Flex
                      key={`${item.label}-${item.product_name}`}
                      direction='column'
                      spacing={1}
                      className='border-border/60 rounded-xl border p-4'
                    >
                      <Flex direction='row' align='center' spacing={2} className='flex-wrap'>
                        <Badge variant='secondary' className='bg-accent/10 text-accent'>
                          {item.label}
                        </Badge>
                        <Typography.Text className='text-sm font-semibold'>
                          {item.product_name}
                        </Typography.Text>
                      </Flex>
                      <Typography.Muted className='text-sm leading-relaxed'>
                        {item.reason}
                      </Typography.Muted>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            ) : null}

            {insight.tradeoffs && insight.tradeoffs.length > 0 ? (
              <Flex direction='column' spacing={3}>
                <Flex direction='row' align='center' spacing={2}>
                  <IconScale className='text-muted-foreground size-4' />
                  <Typography.Text className='font-medium'>{t('tradeoffs')}</Typography.Text>
                </Flex>
                <ul className='text-muted-foreground space-y-2 ps-1 text-sm leading-relaxed'>
                  {insight.tradeoffs.map((item) => (
                    <li key={item} className='flex gap-2'>
                      <span className='text-muted-foreground/60 mt-2 size-1 shrink-0 rounded-full bg-current' />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Flex>
            ) : null}

            <Typography.Muted className='text-center text-xs'>{t('footer')}</Typography.Muted>
          </Flex>
        ) : null}
      </Card>
    </section>
  );
}
