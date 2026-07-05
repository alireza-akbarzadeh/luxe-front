'use client';

import {
  IconAlertTriangle,
  IconSparkles,
  IconTrendingDown,
  IconTrendingUp
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Message, MessageContent, MessageResponse } from '@/components/ai/message';
import { Shimmer } from '@/components/ai/shimmer';
import { Badge } from '@/components/ui/badge';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useProductPricePrediction } from '@/domains/product/hooks/use-product-price-prediction';
import { cn } from '@/lib/utils';
import type { DtoAiPricePredictionResponse } from '@/services/-ai-price-prediction-post.schemas';

type ProductPricePredictionProps = {
  productId: number;
  enabled?: boolean;
  className?: string;
};

function trendIcon(direction?: string) {
  if (direction === 'up') {
    return <IconTrendingUp className='size-4 shrink-0' />;
  }
  if (direction === 'down') {
    return <IconTrendingDown className='size-4 shrink-0' />;
  }
  return <IconSparkles className='text-gold-strong size-4 shrink-0' />;
}

function recommendationBadgeClass(recommendation?: string) {
  switch (recommendation) {
    case 'buy_now':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
    case 'wait':
      return 'border-amber-600/30 bg-amber-500/10 text-amber-900 dark:text-amber-300';
    default:
      return 'border-border/60 bg-muted/50 text-muted-foreground';
  }
}

/** AI price trend forecast shown below the PDP price history chart. */
export function ProductPricePrediction({
  productId,
  enabled = false,
  className
}: ProductPricePredictionProps) {
  const t = useTranslations('pdp.pricePrediction');
  const { fetchPricePrediction, isPending, offlineMessage } = useProductPricePrediction(productId);
  const [insight, setInsight] = useState<DtoAiPricePredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || productId <= 0) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setError(null);
      setInsight(null);
      const result = await fetchPricePrediction();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- enabled + productId gate fetch
  }, [productId, enabled]);

  if (!enabled) {
    return <div className={cn('min-h-[6.5rem]', className)} aria-hidden />;
  }

  return (
    <div className={cn('min-h-[6.5rem]', className)}>
      <Flex direction='row' align='center' justify='between' spacing={2} className='mb-3 gap-2'>
        <Flex direction='row' align='center' spacing={2} className='min-w-0'>
          {trendIcon(insight?.direction)}
          <Typography.Text className='text-sm font-semibold'>{t('title')}</Typography.Text>
        </Flex>
        {insight?.recommendation ? (
          <Badge
            variant='outline'
            className={cn(
              'shrink-0 rounded-full',
              recommendationBadgeClass(insight.recommendation)
            )}
          >
            {t(`recommendation.${insight.recommendation}`)}
          </Badge>
        ) : null}
      </Flex>

      {isPending ? (
        <Shimmer as='span' className='text-muted-foreground text-sm'>
          {t('loading')}
        </Shimmer>
      ) : error ? (
        <Flex
          direction='row'
          align='start'
          spacing={2}
          className='text-muted-foreground gap-2 text-sm'
        >
          <IconAlertTriangle className='mt-0.5 size-4 shrink-0' />
          <span>{error}</span>
        </Flex>
      ) : insight ? (
        <Flex direction='column' spacing={2}>
          {insight.summary ? (
            <Message from='assistant' className='max-w-none'>
              <MessageContent className='w-full max-w-none px-0 py-0'>
                <MessageResponse className='text-muted-foreground text-sm leading-relaxed'>
                  {insight.summary}
                </MessageResponse>
              </MessageContent>
            </Message>
          ) : null}
          {insight.predicted_range ? (
            <Typography.Muted className='text-xs'>
              {t('predictedRange', { range: insight.predicted_range })}
            </Typography.Muted>
          ) : null}
          {insight.highlights && insight.highlights.length > 0 ? (
            <ul className='text-muted-foreground space-y-1.5 ps-1 text-xs leading-relaxed'>
              {insight.highlights.map((item) => (
                <li key={item} className='flex gap-2'>
                  <span className='text-muted-foreground/60 mt-1.5 size-1 shrink-0 rounded-full bg-current' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <Typography.Muted className='text-[11px]'>{t('footer')}</Typography.Muted>
        </Flex>
      ) : null}
    </div>
  );
}
