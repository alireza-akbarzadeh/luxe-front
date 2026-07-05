'use client';

import { IconAlertTriangle, IconShieldCheck, IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Message, MessageContent, MessageResponse } from '@/components/ai/message';
import { Shimmer } from '@/components/ai/shimmer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { PdpInsightShell } from '@/domains/product/components/pdp-insight-shell';
import { useProductTrustScore } from '@/domains/product/hooks/use-product-trust-score';
import { PDP_SCORE_CARD_SHELL_CLASS } from '@/domains/product/lib/pdp-insight-layout';
import { cn } from '@/lib/utils';
import type { DtoAiTrustScoreResponse } from '@/services/-ai-trust-score-post.schemas';

type ProductTrustScoreProps = {
  productId: number;
  enabled?: boolean;
  className?: string;
};

function scoreRingClass(score: number) {
  if (score >= 75) {
    return 'text-emerald-600 dark:text-emerald-400';
  }
  if (score >= 50) {
    return 'text-gold-strong';
  }
  return 'text-amber-700 dark:text-amber-400';
}

function confidenceBadgeClass(confidence?: string) {
  switch (confidence) {
    case 'high':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
    case 'low':
      return 'border-border/60 bg-muted/50 text-muted-foreground';
    default:
      return 'border-gold/30 bg-gold/10 text-gold-strong';
  }
}

function TrustScoreRing({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const degrees = (clamped / 100) * 360;

  return (
    <div
      className={cn(
        'relative flex size-20 shrink-0 items-center justify-center rounded-full',
        scoreRingClass(clamped)
      )}
      style={{
        background: `conic-gradient(currentColor ${degrees}deg, color-mix(in oklab, currentColor 18%, transparent) ${degrees}deg)`
      }}
      aria-hidden
    >
      <div className='bg-card flex size-[4.25rem] flex-col items-center justify-center rounded-full'>
        <span className='text-xl font-semibold tabular-nums'>{clamped}</span>
        <span className='text-muted-foreground text-[10px] font-medium tracking-wide uppercase'>
          /100
        </span>
      </div>
    </div>
  );
}

/** AI trust score card with factor breakdown for PDP insights. */
export function ProductTrustScore({
  productId,
  enabled = false,
  className
}: ProductTrustScoreProps) {
  const t = useTranslations('pdp.trustScore');
  const { fetchTrustScore, isPending, offlineMessage } = useProductTrustScore(productId);
  const [insight, setInsight] = useState<DtoAiTrustScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || productId <= 0) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setError(null);
      setInsight(null);
      const result = await fetchTrustScore();
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

  if (productId <= 0) {
    return null;
  }

  if (!enabled) {
    return (
      <PdpInsightShell
        title={t('title')}
        icon={<IconSparkles className='text-gold-strong size-5 shrink-0' />}
        shellClassName={cn(PDP_SCORE_CARD_SHELL_CLASS, 'h-full')}
        className={className}
      />
    );
  }

  return (
    <Card
      className={cn(
        'border-border/70 from-card to-muted/20 h-full rounded-2xl border bg-linear-to-br p-5 sm:p-6',
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
        {insight?.confidence ? (
          <Badge
            variant='outline'
            className={cn(
              'shrink-0 rounded-full capitalize',
              confidenceBadgeClass(insight.confidence)
            )}
          >
            {t(`confidence.${insight.confidence}`)}
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
          <Flex direction='row' align='start' spacing={4} className='gap-4'>
            {typeof insight.score === 'number' ? <TrustScoreRing score={insight.score} /> : null}
            <Flex direction='column' spacing={2} className='min-w-0 flex-1'>
              <Flex direction='row' align='center' spacing={2} className='text-sm font-medium'>
                <IconShieldCheck className='text-gold-strong size-4 shrink-0' />
                <span>{t('scoreLabel')}</span>
              </Flex>
              {insight.summary ? (
                <Message from='assistant' className='max-w-none'>
                  <MessageContent className='w-full max-w-none px-0 py-0'>
                    <MessageResponse className='text-muted-foreground text-sm leading-relaxed'>
                      {insight.summary}
                    </MessageResponse>
                  </MessageContent>
                </Message>
              ) : null}
              {typeof insight.average_rating === 'number' && insight.review_count ? (
                <Typography.Muted className='text-xs'>
                  {t('reviewStats', {
                    rating: insight.average_rating,
                    count: insight.review_count
                  })}
                </Typography.Muted>
              ) : null}
            </Flex>
          </Flex>

          {insight.factors && insight.factors.length > 0 ? (
            <Grid template='1-2' gap={3}>
              {insight.factors.map((factor) => (
                <div
                  key={factor.key ?? factor.label}
                  className='border-border/60 bg-background/60 rounded-xl border p-3'
                >
                  <Flex
                    direction='row'
                    align='center'
                    justify='between'
                    spacing={2}
                    className='mb-1'
                  >
                    <Typography.Text className='text-sm font-medium'>
                      {factor.label}
                    </Typography.Text>
                    <span
                      className={cn(
                        'text-sm font-semibold tabular-nums',
                        scoreRingClass(factor.score ?? 0)
                      )}
                    >
                      {factor.score ?? 0}
                    </span>
                  </Flex>
                  {factor.note ? (
                    <Typography.Muted className='text-xs leading-relaxed'>
                      {factor.note}
                    </Typography.Muted>
                  ) : null}
                </div>
              ))}
            </Grid>
          ) : null}

          <Typography.Muted className='text-center text-xs'>{t('footer')}</Typography.Muted>
        </Flex>
      ) : null}
    </Card>
  );
}
