'use client';

import { IconAlertTriangle, IconLeaf, IconSparkles } from '@tabler/icons-react';
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
import { useProductSustainabilityScore } from '@/domains/product/hooks/use-product-sustainability-score';
import { PDP_WIDE_INSIGHT_SHELL_CLASS } from '@/domains/product/lib/pdp-insight-layout';
import { cn } from '@/lib/utils';
import type { DtoAiSustainabilityScoreResponse } from '@/services/-ai-sustainability-score-post.schemas';

type ProductSustainabilityScoreProps = {
  productId: number;
  enabled?: boolean;
  className?: string;
};

function scoreRingClass(score: number) {
  if (score >= 75) {
    return 'text-emerald-600 dark:text-emerald-400';
  }
  if (score >= 50) {
    return 'text-teal-700 dark:text-teal-400';
  }
  return 'text-amber-700 dark:text-amber-400';
}

function ratingBadgeClass(rating?: string) {
  switch (rating) {
    case 'leading':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
    case 'good':
      return 'border-teal-600/30 bg-teal-500/10 text-teal-900 dark:text-teal-300';
    case 'mixed':
      return 'border-amber-600/30 bg-amber-500/10 text-amber-900 dark:text-amber-300';
    default:
      return 'border-border/60 bg-muted/50 text-muted-foreground';
  }
}

function pillarBarClass(score: number) {
  if (score >= 75) {
    return 'bg-emerald-500';
  }
  if (score >= 50) {
    return 'bg-teal-500';
  }
  if (score >= 35) {
    return 'bg-amber-500';
  }
  return 'bg-muted-foreground/40';
}

function SustainabilityScoreRing({ score }: { score: number }) {
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

/** AI sustainability score card for PDP insights. */
export function ProductSustainabilityScore({
  productId,
  enabled = false,
  className
}: ProductSustainabilityScoreProps) {
  const t = useTranslations('pdp.sustainabilityScore');
  const { fetchSustainabilityScore, isPending, offlineMessage } =
    useProductSustainabilityScore(productId);
  const [insight, setInsight] = useState<DtoAiSustainabilityScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || productId <= 0) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setError(null);
      setInsight(null);
      const result = await fetchSustainabilityScore();
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
        shellClassName={PDP_WIDE_INSIGHT_SHELL_CLASS}
        className={className}
      />
    );
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
        {insight?.rating ? (
          <Badge
            variant='outline'
            className={cn('shrink-0 rounded-full capitalize', ratingBadgeClass(insight.rating))}
          >
            {t(`rating.${insight.rating}`)}
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
            {typeof insight.score === 'number' ? (
              <SustainabilityScoreRing score={insight.score} />
            ) : null}
            <Flex direction='column' spacing={2} className='min-w-0 flex-1'>
              <Flex direction='row' align='center' spacing={2} className='text-sm font-medium'>
                <IconLeaf className='size-4 shrink-0 text-emerald-700 dark:text-emerald-400' />
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
            </Flex>
          </Flex>

          {insight.pillars && insight.pillars.length > 0 ? (
            <Flex direction='column' spacing={3}>
              <Typography.Text className='text-sm font-medium'>{t('pillars')}</Typography.Text>
              <Grid template='1-2' gap={3} className='sm:grid-cols-2'>
                {insight.pillars.map((pillar) => (
                  <Flex
                    key={pillar.key ?? pillar.label}
                    direction='column'
                    spacing={2}
                    className='border-border/60 bg-muted/20 rounded-xl border p-3'
                  >
                    <Flex direction='row' align='center' justify='between' spacing={2}>
                      <Typography.Text className='text-sm font-medium'>
                        {pillar.label ?? pillar.key}
                      </Typography.Text>
                      {typeof pillar.score === 'number' ? (
                        <span className='text-muted-foreground text-xs tabular-nums'>
                          {pillar.score}
                        </span>
                      ) : null}
                    </Flex>
                    {typeof pillar.score === 'number' ? (
                      <div className='bg-muted h-1.5 overflow-hidden rounded-full'>
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            pillarBarClass(pillar.score)
                          )}
                          style={{ width: `${Math.max(0, Math.min(100, pillar.score))}%` }}
                        />
                      </div>
                    ) : null}
                    {pillar.note ? (
                      <Typography.Muted className='text-xs leading-relaxed'>
                        {pillar.note}
                      </Typography.Muted>
                    ) : null}
                  </Flex>
                ))}
              </Grid>
            </Flex>
          ) : null}

          {insight.highlights && insight.highlights.length > 0 ? (
            <Flex direction='column' spacing={2}>
              <Typography.Text className='text-sm font-medium'>{t('highlights')}</Typography.Text>
              <ul className='text-muted-foreground space-y-2 ps-1 text-sm leading-relaxed'>
                {insight.highlights.map((item) => (
                  <li key={item} className='flex gap-2'>
                    <span className='mt-2 size-1 shrink-0 rounded-full bg-current text-emerald-600/70' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Flex>
          ) : null}

          {insight.watch_outs && insight.watch_outs.length > 0 ? (
            <Flex direction='column' spacing={2}>
              <Typography.Text className='text-sm font-medium'>{t('watchOuts')}</Typography.Text>
              <ul className='text-muted-foreground space-y-2 ps-1 text-sm leading-relaxed'>
                {insight.watch_outs.map((item) => (
                  <li key={item} className='flex gap-2'>
                    <span className='mt-2 size-1 shrink-0 rounded-full bg-current text-amber-600/70' />
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
