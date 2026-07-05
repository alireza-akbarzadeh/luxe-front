'use client';

import {
  IconAlertTriangle,
  IconCircleCheck,
  IconShieldCheck,
  IconSparkles
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Message, MessageContent, MessageResponse } from '@/components/ai/message';
import { Shimmer } from '@/components/ai/shimmer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useProductReturnRisk } from '@/domains/product/hooks/use-product-return-risk';
import { cn } from '@/lib/utils';
import type { DtoAiReturnRiskResponse } from '@/services/-ai-return-risk-post.schemas';

type ProductReturnRiskInsightProps = {
  productId: number;
  className?: string;
};

function riskBadgeClass(level?: string) {
  switch (level) {
    case 'low':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
    case 'high':
      return 'border-amber-600/30 bg-amber-500/10 text-amber-900 dark:text-amber-300';
    default:
      return 'border-gold/30 bg-gold/10 text-gold-strong';
  }
}

function RiskIcon({ level }: { level?: string }) {
  if (level === 'low') {
    return <IconCircleCheck className='size-5 shrink-0 text-emerald-600 dark:text-emerald-400' />;
  }
  if (level === 'high') {
    return <IconAlertTriangle className='size-5 shrink-0 text-amber-700 dark:text-amber-400' />;
  }
  return <IconShieldCheck className='text-gold-strong size-5 shrink-0' />;
}

/** AI return-risk insight card for PDP trust signals. */
export function ProductReturnRiskInsight({ productId, className }: ProductReturnRiskInsightProps) {
  const t = useTranslations('pdp.returnRisk');
  const { fetchReturnRisk, isPending, offlineMessage } = useProductReturnRisk(productId);
  const [insight, setInsight] = useState<DtoAiReturnRiskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId <= 0) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setError(null);
      setInsight(null);
      const result = await fetchReturnRisk();
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
    // Fetch once per product on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- productId gate only
  }, [productId]);

  if (productId <= 0) {
    return null;
  }

  return (
    <Card
      className={cn(
        'border-border/70 from-card to-muted/20 rounded-2xl border bg-linear-to-br p-5 sm:p-6',
        className
      )}
    >
      <Flex direction='row' align='center' justify='between' spacing={3} className='mb-4 gap-3'>
        <Flex direction='row' align='center' spacing={2} className='min-w-0'>
          <IconSparkles className='text-gold-strong size-5 shrink-0' />
          <Typography.H3 className='text-base font-semibold tracking-tight'>
            {t('title')}
          </Typography.H3>
        </Flex>
        {insight?.risk_level ? (
          <Badge
            variant='outline'
            className={cn('shrink-0 rounded-full capitalize', riskBadgeClass(insight.risk_level))}
          >
            {t(`riskLevel.${insight.risk_level}`)}
          </Badge>
        ) : null}
      </Flex>

      {isPending ? (
        <Flex direction='column' spacing={2} className='py-2'>
          <Shimmer as='span' className='text-muted-foreground text-sm'>
            {t('loading')}
          </Shimmer>
        </Flex>
      ) : error ? (
        <Flex direction='column' spacing={2} align='center' className='py-4 text-center'>
          <IconAlertTriangle className='text-muted-foreground size-5' />
          <Typography.Text variant='small' className='text-muted-foreground max-w-sm'>
            {error}
          </Typography.Text>
        </Flex>
      ) : insight ? (
        <Flex direction='column' spacing={5}>
          <Flex direction='row' align='start' spacing={3}>
            <RiskIcon level={insight.risk_level} />
            <Flex direction='column' spacing={2} className='min-w-0 flex-1'>
              {insight.summary ? (
                <Message from='assistant' className='max-w-none'>
                  <MessageContent className='w-full max-w-none px-0 py-0'>
                    <MessageResponse className='text-muted-foreground text-sm leading-relaxed'>
                      {insight.summary}
                    </MessageResponse>
                  </MessageContent>
                </Message>
              ) : null}

              {typeof insight.return_rate_pct === 'number' && insight.order_sample_size ? (
                <Typography.Muted className='text-xs'>
                  {t('returnRate', {
                    rate: insight.return_rate_pct,
                    orders: insight.order_sample_size
                  })}
                </Typography.Muted>
              ) : null}
            </Flex>
          </Flex>

          {insight.common_reasons && insight.common_reasons.length > 0 ? (
            <Flex direction='column' spacing={2}>
              <Typography.Text className='text-sm font-medium'>
                {t('commonReasons')}
              </Typography.Text>
              <ul className='text-muted-foreground space-y-2 ps-1 text-sm leading-relaxed'>
                {insight.common_reasons.map((item) => (
                  <li key={item} className='flex gap-2'>
                    <span className='text-muted-foreground/60 mt-2 size-1 shrink-0 rounded-full bg-current' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Flex>
          ) : null}

          {insight.tips && insight.tips.length > 0 ? (
            <Flex direction='column' spacing={2}>
              <Typography.Text className='text-sm font-medium'>{t('tips')}</Typography.Text>
              <ul className='text-muted-foreground space-y-2 ps-1 text-sm leading-relaxed'>
                {insight.tips.map((item) => (
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
  );
}
