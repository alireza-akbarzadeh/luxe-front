'use client';

import { IconCalendarEvent, IconCoin, IconPackage, IconStar, IconTag } from '@tabler/icons-react';
import { parseISO } from 'date-fns';
import { useFormatter, useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { PdpInsightShell } from '@/domains/product/components/pdp-insight-shell';
import { PDP_WIDE_INSIGHT_SHELL_CLASS } from '@/domains/product/lib/pdp-insight-layout';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { useGetProductsIdTimeline } from '@/services/-products-{id}-timeline-get';
import type { DtoProductTimelineEvent } from '@/services/-products-{id}-timeline-get.schemas';

type ProductTimelineProps = {
  productId: string | number;
  enabled?: boolean;
  className?: string;
};

function eventIcon(type?: string): ReactNode {
  switch (type) {
    case 'price_drop':
    case 'price_increase':
      return <IconCoin className='text-gold-strong size-4' />;
    case 'sold_out':
    case 'restocked':
      return <IconPackage className='text-accent size-4' />;
    case 'first_review':
    case 'reviews_milestone':
      return <IconStar className='size-4 text-amber-500' />;
    case 'published':
    case 'listed':
      return <IconTag className='text-muted-foreground size-4' />;
    default:
      return <IconCalendarEvent className='text-muted-foreground size-4' />;
  }
}

function TimelineRow({
  event,
  label,
  detail
}: {
  event: DtoProductTimelineEvent;
  label: string;
  detail?: string;
}) {
  const formatter = useFormatter();
  const dateLabel = event.occurred_at
    ? formatter.dateTime(parseISO(event.occurred_at), {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  return (
    <Flex direction='row' align='start' spacing={3} className='relative pb-6 last:pb-0'>
      <Flex
        align='center'
        justify='center'
        className='bg-muted/60 border-border z-10 size-8 shrink-0 rounded-full border'
      >
        {eventIcon(event.type)}
      </Flex>
      <Flex direction='column' spacing={0.5} className='min-w-0 flex-1 pt-0.5'>
        <Typography.Small className='font-medium'>{label}</Typography.Small>
        {detail ? <Typography.Muted className='text-xs'>{detail}</Typography.Muted> : null}
        <Typography.Muted className='text-xs'>{dateLabel}</Typography.Muted>
      </Flex>
    </Flex>
  );
}

/** Product lifecycle timeline on PDP insights. */
export function ProductTimeline({ productId, enabled = false, className }: ProductTimelineProps) {
  const t = useTranslations('pdp.timeline');
  const { formatPrice } = useLocaleFormatters();

  const { data, isLoading } = useGetProductsIdTimeline(
    String(productId),
    { days: 365 },
    { query: { enabled: enabled && Boolean(productId) } }
  );

  const timeline = data?.data;
  const events = timeline?.events ?? [];

  const describeEvent = (event: DtoProductTimelineEvent) => {
    const type = event.type ?? 'status_change';
    const label = t.has(`events.${type}`) ? t(`events.${type}`) : t('events.status_change');

    let detail: string | undefined;
    if (type === 'price_drop' || type === 'price_increase') {
      const from = event.meta?.price_from;
      const to = event.meta?.price_to;
      if (from != null && to != null) {
        detail = t('priceChange', { from: formatPrice(from), to: formatPrice(to) });
      }
    } else if (type === 'first_review' && event.meta?.review_rating != null) {
      detail = t('firstReviewDetail', { rating: event.meta.review_rating });
    } else if (type === 'reviews_milestone' && event.meta?.review_count != null) {
      detail = t('reviewsMilestoneDetail', { count: event.meta.review_count });
    } else if (event.meta?.workflow_state) {
      detail = event.meta.workflow_state;
    }

    return { label, detail };
  };

  if (!enabled) {
    return (
      <PdpInsightShell
        title={t('title')}
        icon={<IconCalendarEvent className='text-gold-strong size-5' />}
        shellClassName={PDP_WIDE_INSIGHT_SHELL_CLASS}
        className={className}
      />
    );
  }

  if (isLoading) {
    return (
      <PdpInsightShell
        title={t('title')}
        icon={<IconCalendarEvent className='text-gold-strong size-5' />}
        shellClassName={PDP_WIDE_INSIGHT_SHELL_CLASS}
        className={className}
      >
        <Skeleton className='min-h-[10rem] rounded-xl' />
      </PdpInsightShell>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <PdpInsightShell
      title={t('title')}
      icon={<IconCalendarEvent className='text-gold-strong size-5' />}
      shellClassName={PDP_WIDE_INSIGHT_SHELL_CLASS}
      className={className}
    >
      <div className='border-border relative ms-4 border-s ps-6'>
        {events.map((event, index) => {
          const { label, detail } = describeEvent(event);
          return (
            <TimelineRow
              key={`${event.type}-${event.occurred_at}-${index}`}
              event={event}
              label={label}
              detail={detail}
            />
          );
        })}
      </div>
      <Typography.Muted className='mt-4 text-xs'>{t('footer')}</Typography.Muted>
    </PdpInsightShell>
  );
}
