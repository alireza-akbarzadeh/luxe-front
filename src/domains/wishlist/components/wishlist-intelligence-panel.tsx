'use client';

import { IconAlertTriangle, IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Shimmer } from '@/components/ai/shimmer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useWishlistIntelligence } from '@/domains/wishlist/hooks/use-wishlist-intelligence';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import type { DtoAiWishlistIntelligenceResponse } from '@/services/-ai-wishlist-intelligence-post.schemas';

type WishlistIntelligencePanelProps = {
  itemCount: number;
  className?: string;
};

function priorityBadgeClass(priority?: string) {
  switch (priority) {
    case 'buy_now':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
    case 'watch':
      return 'border-sky-600/30 bg-sky-500/10 text-sky-900 dark:text-sky-300';
    case 'wait':
      return 'border-amber-600/30 bg-amber-500/10 text-amber-900 dark:text-amber-300';
    case 'remove':
      return 'border-destructive/30 bg-destructive/10 text-destructive';
    default:
      return 'border-border/60 bg-muted/40 text-muted-foreground';
  }
}

/** AI summary and per-item priorities at the top of the wishlist page. */
export function WishlistIntelligencePanel({
  itemCount,
  className
}: WishlistIntelligencePanelProps) {
  const t = useTranslations('account.wishlist.intelligence');
  const { formatPrice } = useLocaleFormatters();
  const { fetchWishlistIntelligence, isPending, offlineMessage } = useWishlistIntelligence();
  const [intelligence, setIntelligence] = useState<DtoAiWishlistIntelligenceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (itemCount <= 0) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setError(null);
      setIntelligence(null);
      const result = await fetchWishlistIntelligence(Math.min(itemCount, 30));
      if (cancelled) {
        return;
      }
      if (!result) {
        setError(offlineMessage);
        return;
      }
      setIntelligence(result);
    };

    void load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- itemCount gates fetch
  }, [itemCount]);

  if (itemCount <= 0) {
    return null;
  }

  if (!isPending && !error && !intelligence) {
    return null;
  }

  return (
    <Card
      className={cn(
        'border-border/70 from-card to-muted/20 mb-6 rounded-2xl border bg-linear-to-br p-5 sm:p-6',
        className
      )}
    >
      <Flex direction='row' align='center' spacing={2} className='mb-4'>
        <IconSparkles className='text-gold-strong size-5 shrink-0' />
        <Typography.H3 className='text-base font-semibold tracking-tight'>
          {t('title')}
        </Typography.H3>
      </Flex>

      {isPending ? (
        <Shimmer as='span' className='text-muted-foreground text-sm'>
          {t('loading')}
        </Shimmer>
      ) : error ? (
        <Flex direction='row' align='start' spacing={2}>
          <IconAlertTriangle className='text-muted-foreground mt-0.5 size-4 shrink-0' />
          <Typography.Muted className='text-sm leading-relaxed'>{error}</Typography.Muted>
        </Flex>
      ) : intelligence ? (
        <Flex direction='column' spacing={4}>
          {intelligence.summary ? (
            <Typography.Muted className='text-sm leading-relaxed'>
              {intelligence.summary}
            </Typography.Muted>
          ) : null}

          {(intelligence.estimated_savings ?? 0) > 0 ||
          (intelligence.highlights?.length ?? 0) > 0 ? (
            <Flex direction='column' spacing={2}>
              {(intelligence.estimated_savings ?? 0) > 0 ? (
                <Typography.Text className='text-sm font-medium'>
                  {t('estimatedSavings', { amount: formatPrice(intelligence.estimated_savings) })}
                </Typography.Text>
              ) : null}
              {intelligence.highlights && intelligence.highlights.length > 0 ? (
                <ul className='text-muted-foreground space-y-1.5 ps-1 text-sm leading-relaxed'>
                  {intelligence.highlights.map((highlight) => (
                    <li key={highlight} className='flex gap-2'>
                      <span className='text-muted-foreground/60 mt-2 size-1 shrink-0 rounded-full bg-current' />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Flex>
          ) : null}

          {intelligence.items && intelligence.items.length > 0 ? (
            <Flex direction='column' spacing={2}>
              <Typography.Text className='text-sm font-medium'>{t('priorities')}</Typography.Text>
              <ul className='divide-border/60 divide-y rounded-xl border'>
                {intelligence.items.map((item) => (
                  <li
                    key={item.product_id}
                    className='flex flex-col gap-2 p-3 sm:flex-row sm:items-start sm:justify-between'
                  >
                    <Flex direction='column' spacing={1} className='min-w-0'>
                      <Typography.Text className='truncate text-sm font-medium'>
                        {item.product_name}
                      </Typography.Text>
                      {item.reason ? (
                        <Typography.Muted className='text-xs leading-relaxed'>
                          {item.reason}
                        </Typography.Muted>
                      ) : null}
                    </Flex>
                    {item.priority ? (
                      <Badge
                        variant='outline'
                        className={cn(
                          'w-fit shrink-0 rounded-full capitalize',
                          priorityBadgeClass(item.priority)
                        )}
                      >
                        {t(`priority.${item.priority}`)}
                      </Badge>
                    ) : null}
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
