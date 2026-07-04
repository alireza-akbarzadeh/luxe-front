'use client';

import { IconAlertTriangle, IconSparkles, IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Message, MessageContent, MessageResponse } from '@/components/ai/message';
import { Shimmer } from '@/components/ai/shimmer';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import {
  MIN_REVIEWS_FOR_AI_SUMMARY,
  useProductReviewSummary
} from '@/domains/product/hooks/use-product-review-summary';
import type { DtoAiReviewSummaryResponse } from '@/services/-ai-review-summary-post.schemas';

type ProductReviewAiSummaryProps = {
  productId: number;
  reviewCount: number;
};

/** AI distillation of buyer reviews — shown when a product has enough approved reviews. */
export function ProductReviewAiSummary({ productId, reviewCount }: ProductReviewAiSummaryProps) {
  const t = useTranslations('pdp.reviews.aiSummary');
  const { fetchSummary, isPending } = useProductReviewSummary(productId);
  const [summary, setSummary] = useState<DtoAiReviewSummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const qualifies = productId > 0 && reviewCount >= MIN_REVIEWS_FOR_AI_SUMMARY;

  useEffect(() => {
    if (!qualifies) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setError(null);
      setSummary(null);
      const result = await fetchSummary();
      if (cancelled) {
        return;
      }
      if (!result) {
        setError(t('unavailable'));
        return;
      }
      setSummary(result);
    };

    void load();

    return () => {
      cancelled = true;
    };
    // Fetch once per product when review count qualifies.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- productId + reviewCount gate only
  }, [productId, reviewCount, qualifies]);

  if (!qualifies) {
    return null;
  }

  return (
    <Card className='border-gold/25 from-gold/5 to-card rounded-2xl border bg-linear-to-br p-5 sm:p-6'>
      <Flex direction='row' align='center' spacing={2} className='mb-4'>
        <IconSparkles className='text-gold-strong size-5 shrink-0' />
        <Typography.H3 className='text-base font-semibold tracking-tight'>
          {t('title')}
        </Typography.H3>
      </Flex>

      {isPending ? (
        <Flex direction='column' spacing={2} className='py-4'>
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
      ) : summary ? (
        <Flex direction='column' spacing={5}>
          {summary.summary ? (
            <Message from='assistant' className='max-w-none'>
              <MessageContent className='w-full max-w-none'>
                <MessageResponse className='text-muted-foreground text-sm'>
                  {summary.summary}
                </MessageResponse>
              </MessageContent>
            </Message>
          ) : null}

          {summary.highlights && summary.highlights.length > 0 ? (
            <Flex direction='column' spacing={2}>
              <Flex direction='row' align='center' spacing={2}>
                <IconThumbUp className='size-4 text-emerald-600 dark:text-emerald-400' />
                <Typography.Text className='text-sm font-medium'>{t('highlights')}</Typography.Text>
              </Flex>
              <ul className='text-muted-foreground space-y-2 ps-1 text-sm leading-relaxed'>
                {summary.highlights.map((item) => (
                  <li key={item} className='flex gap-2'>
                    <span className='text-muted-foreground/60 mt-2 size-1 shrink-0 rounded-full bg-current' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Flex>
          ) : null}

          {summary.watch_outs && summary.watch_outs.length > 0 ? (
            <Flex direction='column' spacing={2}>
              <Flex direction='row' align='center' spacing={2}>
                <IconThumbDown className='size-4 text-amber-700 dark:text-amber-400' />
                <Typography.Text className='text-sm font-medium'>{t('watchOuts')}</Typography.Text>
              </Flex>
              <ul className='text-muted-foreground space-y-2 ps-1 text-sm leading-relaxed'>
                {summary.watch_outs.map((item) => (
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
