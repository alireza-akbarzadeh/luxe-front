'use client';

import { IconSparkles, IconTruck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Message, MessageContent, MessageResponse } from '@/components/ai/message';
import { Shimmer } from '@/components/ai/shimmer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { PdpInsightShell } from '@/domains/product/components/pdp-insight-shell';
import { useProductDeliveryPrediction } from '@/domains/product/hooks/use-product-delivery-prediction';
import { PDP_WIDE_INSIGHT_SHELL_CLASS } from '@/domains/product/lib/pdp-insight-layout';
import { cn } from '@/lib/utils';
import type { DtoAiDeliveryPredictionResponse } from '@/services/-ai-delivery-prediction-post.schemas';

type ProductDeliveryPredictionProps = {
  productId: number;
  enabled?: boolean;
  className?: string;
};

function speedBadgeClass(speed?: string) {
  switch (speed) {
    case 'fast':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
    case 'digital':
      return 'border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-300';
    default:
      return 'border-gold/30 bg-gold/10 text-gold-strong';
  }
}

/** AI estimated delivery window for PDP shoppers. */
export function ProductDeliveryPrediction({
  productId,
  enabled = false,
  className
}: ProductDeliveryPredictionProps) {
  const t = useTranslations('pdp.deliveryPrediction');
  const { fetchDeliveryPrediction, isPending, offlineMessage } =
    useProductDeliveryPrediction(productId);
  const [prediction, setPrediction] = useState<DtoAiDeliveryPredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || productId <= 0) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setError(null);
      setPrediction(null);
      const result = await fetchDeliveryPrediction();
      if (cancelled) {
        return;
      }
      if (!result) {
        setError(offlineMessage);
        return;
      }
      setPrediction(result);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [enabled, productId, fetchDeliveryPrediction, offlineMessage]);

  if (!enabled) {
    return (
      <PdpInsightShell
        title={t('title')}
        icon={<IconTruck className='text-gold-strong size-5' />}
        shellClassName={PDP_WIDE_INSIGHT_SHELL_CLASS}
        className={className}
      />
    );
  }

  if (isPending && !prediction && !error) {
    return (
      <PdpInsightShell
        title={t('title')}
        icon={<IconTruck className='text-gold-strong size-5' />}
        shellClassName={PDP_WIDE_INSIGHT_SHELL_CLASS}
        className={className}
      >
        <Shimmer className='min-h-[8rem] rounded-xl'>{t('loading')}</Shimmer>
      </PdpInsightShell>
    );
  }

  if (error || !prediction) {
    return null;
  }

  const speedKey = prediction.speed ?? 'standard';
  const speedLabel = t.has(`speed.${speedKey}`) ? t(`speed.${speedKey}`) : t('speed.standard');

  return (
    <Card
      className={cn(
        'border-border/70 from-card to-muted/20 rounded-2xl border bg-linear-to-br p-5 sm:p-6',
        PDP_WIDE_INSIGHT_SHELL_CLASS,
        className
      )}
    >
      <Flex direction='row' align='center' spacing={2} className='mb-4'>
        <IconTruck className='text-gold-strong size-5 shrink-0' />
        <Typography.H3 className='text-base font-semibold tracking-tight'>
          {t('title')}
        </Typography.H3>
        <Badge variant='outline' className={cn('ms-auto', speedBadgeClass(prediction.speed))}>
          {speedLabel}
        </Badge>
      </Flex>

      {prediction.delivery_window ? (
        <Typography.Large className='mb-3 font-semibold'>
          {prediction.delivery_window}
        </Typography.Large>
      ) : null}

      <Message from='assistant' className='mb-4'>
        <MessageContent>
          <MessageResponse>{prediction.summary}</MessageResponse>
        </MessageContent>
      </Message>

      {prediction.highlights && prediction.highlights.length > 0 ? (
        <Flex direction='column' spacing={2} className='mb-4'>
          <Typography.Overline className='text-muted-foreground'>
            {t('highlights')}
          </Typography.Overline>
          <ul className='text-muted-foreground space-y-1.5 text-sm'>
            {prediction.highlights.map((item) => (
              <li key={item} className='flex gap-2'>
                <IconSparkles className='text-accent mt-0.5 size-3.5 shrink-0' aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Flex>
      ) : null}

      <Typography.Muted className='text-xs'>{t('footer')}</Typography.Muted>
    </Card>
  );
}
