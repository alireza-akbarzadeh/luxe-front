'use client';

import { format, parseISO } from 'date-fns';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { useGetProductsIdPriceHistory } from '@/services/-products-{id}-price-history-get';
import type { DtoPriceHistoryPoint } from '@/services/-products-{id}-price-history-get.schemas';

const chartConfig = {
  price: { label: 'Price', color: 'hsl(var(--foreground))' },
  compare: { label: 'Was', color: 'hsl(var(--muted-foreground))' }
} satisfies ChartConfig;

function toChartRows(points: DtoPriceHistoryPoint[]) {
  return points.map((point) => ({
    date: point.recorded_at
      ? format(parseISO(point.recorded_at), 'MMM d')
      : '',
    price: point.price ?? 0,
    compare: point.compare_at_price ?? null
  }));
}

interface ProductPriceChartProps {
  productId: string | number;
}

/** Price trend over time for PDP transparency. */
export function ProductPriceChart({ productId }: ProductPriceChartProps) {
  const { data, isLoading } = useGetProductsIdPriceHistory(String(productId), { days: 90 });
  const points = data?.data?.points ?? [];

  if (isLoading) {
    return (
      <div className='border-border/60 bg-card space-y-3 rounded-2xl border p-6'>
        <Skeleton className='h-5 w-40' />
        <Skeleton className='h-48 w-full rounded-xl' />
      </div>
    );
  }

  if (points.length < 2) {
    return (
      <div className='border-border/60 bg-muted/20 rounded-2xl border p-6'>
        <h3 className='font-display text-lg font-semibold'>Price history</h3>
        <p className='text-muted-foreground mt-2 text-sm'>
          Price tracking will appear once more history is recorded for this item.
        </p>
      </div>
    );
  }

  const rows = toChartRows(points);
  const first = points[0]?.price ?? 0;
  const last = points[points.length - 1]?.price ?? 0;
  const delta = last - first;
  const deltaPct = first > 0 ? Math.round((delta / first) * 100) : 0;

  return (
    <div className='border-border/60 bg-card rounded-2xl border p-6'>
      <div className='mb-4 flex flex-wrap items-end justify-between gap-3'>
        <div>
          <h3 className='font-display text-lg font-semibold'>Price history</h3>
          <p className='text-muted-foreground text-sm'>Last 90 days</p>
        </div>
        <p className='text-sm tabular-nums'>
          <span className='text-muted-foreground'>Current </span>
          <span className='font-semibold'>{formatPrice(last)}</span>
          {delta !== 0 && (
            <span className={delta < 0 ? 'text-emerald-600' : 'text-destructive'}>
              {' '}
              ({delta > 0 ? '+' : ''}
              {deltaPct}%)
            </span>
          )}
        </p>
      </div>
      <ChartContainer config={chartConfig} className='aspect-auto h-52 w-full'>
        <AreaChart data={rows} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray='4 4' />
          <XAxis dataKey='date' tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `$${Math.round(value)}`}
            width={48}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => formatPrice(Number(value))}
              />
            }
          />
          <Area
            type='monotone'
            dataKey='price'
            stroke='var(--color-price)'
            fill='var(--color-price)'
            fillOpacity={0.12}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
