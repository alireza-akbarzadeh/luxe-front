'use client';

import {
  IconCircleCheck,
  IconTrendingDown,
  IconTrendingUp
} from '@tabler/icons-react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { cn } from '@/lib/utils';
import { useGetProductsIdAlternatives } from '@/services/-products-{id}-alternatives-get';

const chartConfig = {
  price: { label: 'Listing price', color: 'hsl(var(--foreground))' }
} satisfies ChartConfig;

interface ProductMarketSnapshotProps {
  productId: string | number;
  currentPrice?: number;
  compareAtPrice?: number;
  storeName?: string;
}

/** Side-by-side marketplace price comparison for the same model. */
export function ProductMarketSnapshot({
  productId,
  currentPrice = 0,
  compareAtPrice,
  storeName = 'This listing'
}: ProductMarketSnapshotProps) {
  const { data, isLoading } = useGetProductsIdAlternatives(String(productId));
  const alternatives = data?.data?.alternatives ?? [];

  if (isLoading) {
    return (
      <div className='border-border/60 bg-card flex h-full flex-col rounded-2xl border p-6'>
        <Skeleton className='h-5 w-48' />
        <Skeleton className='mt-6 h-40 w-full rounded-xl' />
        <Skeleton className='mt-4 h-16 w-full rounded-xl' />
      </div>
    );
  }

  const rows = [
    { store: storeName, price: currentPrice, isCurrent: true },
    ...alternatives.map((item) => ({
      store: item.store_name ?? 'Store',
      price: Number(item.price ?? 0),
      isCurrent: false
    }))
  ]
    .filter((row) => row.price > 0)
    .sort((a, b) => a.price - b.price);

  const prices = rows.map((row) => row.price);
  const lowest = prices.length ? Math.min(...prices) : currentPrice;
  const highest = prices.length ? Math.max(...prices) : currentPrice;
  const average =
    prices.length > 0 ? prices.reduce((sum, value) => sum + value, 0) / prices.length : currentPrice;
  const isBestPrice = currentPrice <= lowest;
  const savingsVsHigh = highest - currentPrice;
  const msrpSavings =
    compareAtPrice && compareAtPrice > currentPrice ? compareAtPrice - currentPrice : 0;

  return (
    <div className='border-border/60 bg-card flex h-full flex-col rounded-2xl border p-6'>
      <div className='mb-4'>
        <h3 className='font-display text-lg font-semibold'>Marketplace comparison</h3>
        <p className='text-muted-foreground text-sm'>Same model across Luxe sellers</p>
      </div>

      {rows.length > 1 ? (
        <ChartContainer config={chartConfig} className='aspect-auto h-44 w-full'>
          <BarChart
            data={rows}
            layout='vertical'
            margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
            barSize={18}
          >
            <CartesianGrid horizontal={false} strokeDasharray='4 4' />
            <XAxis
              type='number'
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `$${Math.round(value / 100) * 100}`}
            />
            <YAxis
              type='category'
              dataKey='store'
              width={92}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent formatter={(value) => formatPrice(Number(value))} />
              }
            />
            <Bar dataKey='price' radius={[0, 6, 6, 0]}>
              {rows.map((row) => (
                <Cell
                  key={row.store}
                  fill={row.isCurrent ? 'hsl(var(--accent))' : 'hsl(var(--muted-foreground))'}
                  fillOpacity={row.isCurrent ? 0.9 : 0.35}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      ) : (
        <div className='bg-muted/30 flex flex-1 items-center justify-center rounded-xl px-4 py-8 text-center'>
          <p className='text-muted-foreground text-sm'>
            No other store listings yet — you&apos;re viewing the only offer for this model.
          </p>
        </div>
      )}

      <div className='mt-4 grid grid-cols-3 gap-2'>
        <StatPill label='Market low' value={formatPrice(lowest)} positive={isBestPrice} />
        <StatPill label='Average' value={formatPrice(Math.round(average))} />
        <StatPill
          label='Market high'
          value={formatPrice(highest)}
          positive={savingsVsHigh > 0 && isBestPrice}
          hint={isBestPrice && savingsVsHigh > 0 ? `Save ${formatPrice(savingsVsHigh)}` : undefined}
        />
      </div>

      <div className='mt-4 space-y-2'>
        {isBestPrice && rows.length > 1 && (
          <InsightRow
            icon={IconCircleCheck}
            tone='success'
            text='This listing is the best price on Luxe right now.'
          />
        )}
        {msrpSavings > 0 && (
          <InsightRow
            icon={IconTrendingDown}
            tone='success'
            text={`${formatPrice(msrpSavings)} below MSRP (${formatPrice(compareAtPrice)}).`}
          />
        )}
        {!isBestPrice && rows.length > 1 && (
          <InsightRow
            icon={IconTrendingUp}
            tone='muted'
            text={`Another seller lists this model from ${formatPrice(lowest)} — compare before you buy.`}
          />
        )}
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  positive,
  hint
}: {
  label: string;
  value: string;
  positive?: boolean;
  hint?: string;
}) {
  return (
    <div className='bg-muted/35 rounded-xl px-2.5 py-2 text-center'>
      <p className='text-muted-foreground text-[10px] tracking-wide uppercase'>{label}</p>
      <p
        className={cn(
          'mt-0.5 text-sm font-semibold tabular-nums',
          positive && 'text-emerald-600 dark:text-emerald-400'
        )}
      >
        {value}
      </p>
      {hint && <p className='text-emerald-600 mt-0.5 text-[10px] dark:text-emerald-400'>{hint}</p>}
    </div>
  );
}

function InsightRow({
  icon: Icon,
  text,
  tone
}: {
  icon: typeof IconCircleCheck;
  text: string;
  tone: 'success' | 'muted';
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-xl px-3 py-2 text-xs leading-relaxed',
        tone === 'success' ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300' : 'bg-muted/40 text-muted-foreground'
      )}
    >
      <Icon className='mt-0.5 h-4 w-4 shrink-0' />
      <span>{text}</span>
    </div>
  );
}
