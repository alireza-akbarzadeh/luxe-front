'use client';

import { parseISO } from 'date-fns';
import { useFormatter, useTranslations } from 'next-intl';
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from 'recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import { useGetProductsIdPriceHistory } from '@/services/-products-{id}-price-history-get';
import type { DtoPriceHistoryPoint } from '@/services/-products-{id}-price-history-get.schemas';

interface ProductPriceChartProps {
  productId: string | number;
  className?: string;
}

/** Price trend over time for PDP transparency. */
export function ProductPriceChart({ productId, className }: ProductPriceChartProps) {
  const t = useTranslations('pdp.priceChart');
  const formatter = useFormatter();
  const { formatPrice, formatInteger, moneyClassName } = useLocaleFormatters();

  const chartConfig = {
    price: { label: t('salePrice'), color: 'hsl(var(--foreground))' },
    compare: { label: t('listPrice'), color: 'hsl(var(--muted-foreground))' }
  } satisfies ChartConfig;

  const { data, isLoading } = useGetProductsIdPriceHistory(String(productId), { days: 90 });
  const points = data?.data?.points ?? [];

  const formatChartDate = (isoDate: string) => {
    if (!isoDate) return '';
    return formatter.dateTime(parseISO(isoDate), { month: 'short', day: 'numeric' });
  };

  const toChartRows = (historyPoints: DtoPriceHistoryPoint[]) =>
    historyPoints.map((point) => ({
      date: point.recorded_at ? formatChartDate(point.recorded_at) : '',
      price: point.price ?? 0,
      compare: point.compare_at_price ?? null
    }));

  const formatAxisPrice = (value: number) => formatPrice(Math.round(value));

  if (isLoading) {
    return (
      <div
        className={cn(
          'border-border/60 bg-card flex h-full flex-col rounded-2xl border p-6',
          className
        )}
      >
        <Skeleton className='h-5 w-40' />
        <Skeleton className='mt-6 h-40 w-full flex-1 rounded-xl' />
      </div>
    );
  }

  if (points.length < 2) {
    return (
      <div
        className={cn(
          'border-border/60 bg-muted/20 flex h-full flex-col rounded-2xl border p-6',
          className
        )}
      >
        <h3 className='font-display text-lg font-semibold'>{t('title')}</h3>
        <p className='text-muted-foreground mt-2 text-sm'>{t('empty')}</p>
      </div>
    );
  }

  const rows = toChartRows(points);
  const first = points[0]?.price ?? 0;
  const last = points[points.length - 1]?.price ?? 0;
  const high = Math.max(...points.map((point) => point.price ?? 0));
  const low = Math.min(...points.map((point) => point.price ?? 0));
  const delta = last - first;
  const deltaPct = first > 0 ? Math.round((delta / first) * 100) : 0;
  const deltaSign = delta > 0 ? '+' : '';

  return (
    <div
      className={cn(
        'border-border/60 bg-card flex h-full flex-col rounded-2xl border p-6',
        className
      )}
    >
      <div className='mb-4 flex flex-wrap items-end justify-between gap-3'>
        <div>
          <h3 className='font-display text-lg font-semibold'>{t('title')}</h3>
          <p className='text-muted-foreground text-sm'>{t('last90Days')}</p>
        </div>
        <p className={cn('text-sm', moneyClassName)}>
          <span className='text-muted-foreground'>{t('current')} </span>
          <span className='font-semibold'>{formatPrice(last)}</span>
          {delta !== 0 && (
            <span className={delta < 0 ? 'text-emerald-600' : 'text-destructive'}>
              {' '}
              {t('changePercent', { sign: deltaSign, percent: formatInteger(Math.abs(deltaPct)) })}
            </span>
          )}
        </p>
      </div>

      <ChartContainer config={chartConfig} className='aspect-auto h-44 w-full flex-1'>
        <AreaChart data={rows} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray='4 4' />
          <XAxis dataKey='date' tickLine={false} axisLine={false} minTickGap={28} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={formatAxisPrice}
            width={48}
            domain={['auto', 'auto']}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent formatter={(value) => formatPrice(Number(value))} />
            }
          />
          <Area
            type='monotone'
            dataKey='price'
            stroke='var(--color-price)'
            fill='var(--color-price)'
            fillOpacity={0.14}
            strokeWidth={2}
          />
          <Line
            type='monotone'
            dataKey='compare'
            stroke='var(--color-compare)'
            strokeWidth={1.5}
            strokeDasharray='5 4'
            dot={false}
            connectNulls
          />
        </AreaChart>
      </ChartContainer>

      <div className='mt-4 grid grid-cols-3 gap-2 text-center'>
        <div className='bg-muted/35 rounded-xl px-2 py-2'>
          <p className='text-muted-foreground text-[10px] tracking-wide uppercase'>{t('high90')}</p>
          <p className={cn('mt-0.5 text-sm font-semibold', moneyClassName)}>{formatPrice(high)}</p>
        </div>
        <div className='bg-muted/35 rounded-xl px-2 py-2'>
          <p className='text-muted-foreground text-[10px] tracking-wide uppercase'>{t('low90')}</p>
          <p
            className={cn(
              'mt-0.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400',
              moneyClassName
            )}
          >
            {formatPrice(low)}
          </p>
        </div>
        <div className='bg-muted/35 rounded-xl px-2 py-2'>
          <p className='text-muted-foreground text-[10px] tracking-wide uppercase'>{t('range')}</p>
          <p className={cn('mt-0.5 text-sm font-semibold', moneyClassName)}>
            {formatPrice(high - low)}
          </p>
        </div>
      </div>
    </div>
  );
}
