'use client';

import { IconAlertTriangle, IconRuler2, IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Shimmer } from '@/components/ai/shimmer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useProductSizeRecommendation } from '@/domains/product/hooks/use-product-size-recommendation';
import { cn } from '@/lib/utils';
import type { DtoAiSizeRecommendationResponse } from '@/services/-ai-size-recommendation-post.schemas';

type ProductSizeRecommendationProps = {
  productId: number;
  className?: string;
};

function fitNotesBadgeClass(fitNotes?: string) {
  switch (fitNotes) {
    case 'runs_small':
      return 'border-amber-600/30 bg-amber-500/10 text-amber-900 dark:text-amber-300';
    case 'runs_large':
      return 'border-sky-600/30 bg-sky-500/10 text-sky-900 dark:text-sky-300';
    case 'true_to_size':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
    default:
      return 'border-border/60 bg-muted/40 text-muted-foreground';
  }
}

function isApplicableRecommendation(result: DtoAiSizeRecommendationResponse) {
  if (result.recommended_size) {
    return true;
  }
  const summary = result.summary?.toLowerCase() ?? '';
  return !summary.includes('not applicable');
}

/** Compact AI size guidance card in the PDP buy box. */
export function ProductSizeRecommendation({
  productId,
  className
}: ProductSizeRecommendationProps) {
  const t = useTranslations('pdp.sizeRecommendation');
  const { fetchSizeRecommendation, isPending, offlineMessage } =
    useProductSizeRecommendation(productId);
  const [recommendation, setRecommendation] = useState<DtoAiSizeRecommendationResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId <= 0) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setError(null);
      setRecommendation(null);
      const result = await fetchSizeRecommendation();
      if (cancelled) {
        return;
      }
      if (!result) {
        setError(offlineMessage);
        return;
      }
      if (!isApplicableRecommendation(result)) {
        return;
      }
      setRecommendation(result);
    };

    void load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- productId gates fetch
  }, [productId]);

  if (productId <= 0) {
    return null;
  }

  if (!isPending && !error && !recommendation) {
    return null;
  }

  return (
    <Card
      className={cn(
        'border-border/70 from-card to-muted/15 rounded-xl border bg-linear-to-br p-4',
        className
      )}
    >
      <Flex direction='row' align='center' justify='between' spacing={2} className='mb-3 gap-2'>
        <Flex direction='row' align='center' spacing={2} className='min-w-0'>
          <IconRuler2 className='text-gold-strong size-4 shrink-0' />
          <Typography.Text className='text-sm font-medium'>{t('title')}</Typography.Text>
        </Flex>
        {recommendation?.recommended_size ? (
          <Badge
            variant='outline'
            className='border-gold/30 bg-gold/10 text-gold-strong shrink-0 rounded-full'
          >
            {t('recommended', { size: recommendation.recommended_size })}
          </Badge>
        ) : null}
      </Flex>

      {isPending ? (
        <Shimmer as='span' className='text-muted-foreground text-sm'>
          {t('loading')}
        </Shimmer>
      ) : error ? (
        <Flex direction='row' align='start' spacing={2}>
          <IconAlertTriangle className='text-muted-foreground mt-0.5 size-4 shrink-0' />
          <Typography.Muted className='text-xs leading-relaxed'>{error}</Typography.Muted>
        </Flex>
      ) : recommendation ? (
        <Flex direction='column' spacing={3}>
          {recommendation.summary ? (
            <Typography.Muted className='text-sm leading-relaxed'>
              {recommendation.summary}
            </Typography.Muted>
          ) : null}

          <Flex direction='row' wrap='wrap' align='center' spacing={2} className='gap-2'>
            {recommendation.fit_notes ? (
              <Badge
                variant='outline'
                className={cn(
                  'rounded-full capitalize',
                  fitNotesBadgeClass(recommendation.fit_notes)
                )}
              >
                {t(`fitNotes.${recommendation.fit_notes}`)}
              </Badge>
            ) : null}
            {recommendation.alternative_size ? (
              <Typography.Muted className='text-xs'>
                {t('alternative', { size: recommendation.alternative_size })}
              </Typography.Muted>
            ) : null}
            {recommendation.confidence ? (
              <Flex direction='row' align='center' spacing={1} className='text-muted-foreground'>
                <IconSparkles className='size-3' />
                <Typography.Muted className='text-xs capitalize'>
                  {t('confidence', { level: recommendation.confidence })}
                </Typography.Muted>
              </Flex>
            ) : null}
          </Flex>

          {recommendation.tips && recommendation.tips.length > 0 ? (
            <ul className='text-muted-foreground space-y-1.5 ps-1 text-xs leading-relaxed'>
              {recommendation.tips.map((tip) => (
                <li key={tip} className='flex gap-2'>
                  <span className='text-muted-foreground/60 mt-1.5 size-1 shrink-0 rounded-full bg-current' />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <Typography.Muted className='text-[11px]'>{t('footer')}</Typography.Muted>
        </Flex>
      ) : null}
    </Card>
  );
}
