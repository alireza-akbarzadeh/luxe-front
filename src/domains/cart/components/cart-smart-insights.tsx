'use client';

import { IconAlertTriangle, IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { Shimmer } from '@/components/ai/shimmer';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useSmartCart } from '@/domains/cart/hooks/use-smart-cart';
import { ShoppingAssistantRecommendationCard } from '@/domains/shopping-assistant/components/shopping-assistant-recommendation-card';
import { useCartController } from '@/hooks/useCartController';
import type { DtoAiSmartCartResponse } from '@/services/-ai-smart-cart-post.schemas';

/** AI summary, tips, and complementary picks for the authenticated cart page. */
export function CartSmartInsights() {
  const t = useTranslations('cart.smartCart');
  const { items, subtotal } = useCartController();
  const { analyzeCart, offlineMessage } = useSmartCart();
  const [insight, setInsight] = useState<DtoAiSmartCartResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const productIdsKey = useMemo(() => {
    const ids = items
      .map((item) => item.product_id)
      .filter((id): id is number => id !== undefined && id !== null)
      .sort((a, b) => a - b);
    return ids.join(',');
  }, [items]);

  useEffect(() => {
    if (!productIdsKey) {
      return;
    }

    let cancelled = false;
    const productIds = productIdsKey.split(',').map(Number);

    const load = async () => {
      setIsPending(true);
      setError(null);
      const result = await analyzeCart({
        product_ids: productIds,
        subtotal
      });
      if (cancelled) {
        return;
      }
      setIsPending(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on cart contents
  }, [productIdsKey, subtotal]);

  if (!productIdsKey) {
    return null;
  }

  if (!isPending && !error && !insight) {
    return null;
  }

  const hasBody =
    Boolean(insight?.summary) ||
    (insight?.tips?.length ?? 0) > 0 ||
    (insight?.warnings?.length ?? 0) > 0 ||
    (insight?.gaps?.length ?? 0) > 0 ||
    (insight?.recommendations?.length ?? 0) > 0;

  if (!isPending && !error && !hasBody) {
    return null;
  }

  return (
    <Card className='border-border/70 from-card to-muted/15 mb-8 rounded-2xl border bg-linear-to-br p-5 sm:p-6'>
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
      ) : insight ? (
        <Flex direction='column' spacing={4}>
          {insight.summary ? (
            <Typography.Muted className='text-sm leading-relaxed'>
              {insight.summary}
            </Typography.Muted>
          ) : null}

          {insight.tips && insight.tips.length > 0 ? (
            <InsightList title={t('tips')} items={insight.tips} />
          ) : null}

          {insight.warnings && insight.warnings.length > 0 ? (
            <InsightList title={t('warnings')} items={insight.warnings} variant='warning' />
          ) : null}

          {insight.gaps && insight.gaps.length > 0 ? (
            <InsightList title={t('gaps')} items={insight.gaps} />
          ) : null}

          {insight.recommendations && insight.recommendations.length > 0 ? (
            <Flex direction='column' spacing={2}>
              <Typography.Text className='text-sm font-medium'>{t('picks')}</Typography.Text>
              {insight.recommendations.map((item, index) => (
                <ShoppingAssistantRecommendationCard
                  key={String(item.product?.id ?? index)}
                  item={item}
                />
              ))}
            </Flex>
          ) : null}

          <Typography.Muted className='text-center text-xs'>{t('footer')}</Typography.Muted>
        </Flex>
      ) : null}
    </Card>
  );
}

function InsightList({
  title,
  items,
  variant
}: {
  title: string;
  items: string[];
  variant?: 'warning';
}) {
  return (
    <Flex direction='column' spacing={2}>
      <Typography.Text
        className={
          variant === 'warning' ? 'text-destructive text-sm font-medium' : 'text-sm font-medium'
        }
      >
        {title}
      </Typography.Text>
      <ul className='text-muted-foreground space-y-1.5 ps-1 text-sm leading-relaxed'>
        {items.map((item) => (
          <li key={item} className='flex gap-2'>
            <span className='text-muted-foreground/60 mt-2 size-1 shrink-0 rounded-full bg-current' />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Flex>
  );
}
