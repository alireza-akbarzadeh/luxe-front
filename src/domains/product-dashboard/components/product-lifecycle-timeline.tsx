'use client';

import { IconCalendarEvent, IconCoin, IconPackage, IconStar, IconTag } from '@tabler/icons-react';
import { format, parseISO } from 'date-fns';
import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { describeProductTimelineEvent } from '@/domains/product-dashboard/lib/product-timeline-labels';
import { useGetProductsIdTimeline } from '@/services/-products-{id}-timeline-get';
import type { DtoProductTimelineEvent } from '@/services/-products-{id}-timeline-get.schemas';

function eventIcon(type?: string): ReactNode {
  switch (type) {
    case 'price_drop':
    case 'price_increase':
      return <IconCoin className='text-muted-foreground size-4' />;
    case 'sold_out':
    case 'restocked':
      return <IconPackage className='text-muted-foreground size-4' />;
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
  const dateLabel = event.occurred_at ? format(parseISO(event.occurred_at), 'MMM d, yyyy') : '';

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
        {dateLabel ? <Typography.Muted className='text-xs'>{dateLabel}</Typography.Muted> : null}
      </Flex>
    </Flex>
  );
}

interface ProductLifecycleTimelineProps {
  productId: number;
  className?: string;
}

/** Admin product history — listing, pricing, stock, and review milestones. */
export function ProductLifecycleTimeline({ productId, className }: ProductLifecycleTimelineProps) {
  const { data, isLoading } = useGetProductsIdTimeline(String(productId), { days: 365 });

  const events = data?.data?.events ?? [];

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);

  return (
    <Card className={className}>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Product history</CardTitle>
        <CardDescription>
          Key moments in listing, pricing, stock, and reviews over the last year.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='min-h-[8rem] rounded-lg' />
        ) : events.length === 0 ? (
          <Typography.Muted className='text-sm'>
            No lifecycle events recorded yet. Changes will appear here as the product is updated.
          </Typography.Muted>
        ) : (
          <div className='border-border relative ms-4 border-s ps-6'>
            {events.map((event, index) => {
              const { label, detail } = describeProductTimelineEvent(event, formatPrice);
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
        )}
      </CardContent>
    </Card>
  );
}
