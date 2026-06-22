'use client';

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useTranslations } from 'next-intl';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { formatCurrency } from '@/lib/format';

import type { WalletActivityPoint, WalletBalancePoint } from '../lib/wallet-utils';
import { formatWalletChartAxis } from '../lib/wallet-utils';

interface WalletBalanceChartProps {
  balanceSeries: WalletBalancePoint[];
  activitySeries: WalletActivityPoint[];
}

export function WalletBalanceChart({ balanceSeries, activitySeries }: WalletBalanceChartProps) {
  const t = useTranslations('account.wallet');
  const hasActivity = activitySeries.some((point) => point.inflow > 0 || point.outflow > 0);

  const balanceChartConfig = {
    balance: {
      label: t('chartBalance'),
      color: 'var(--gold)'
    }
  } satisfies ChartConfig;

  const activityChartConfig = {
    inflow: {
      label: t('chartInflow'),
      color: 'var(--gold)'
    },
    outflow: {
      label: t('chartOutflow'),
      color: 'hsl(var(--destructive))'
    }
  } satisfies ChartConfig;

  return (
    <div className='grid gap-4 lg:grid-cols-5'>
      <div className='bg-card border-border rounded-2xl border p-4 sm:p-5 lg:col-span-3'>
        <div className='mb-4 flex items-start justify-between gap-3'>
          <div>
            <h3 className='font-display text-lg font-semibold tracking-tight'>
              {t('balanceTrend')}
            </h3>
            <p className='text-muted-foreground text-sm'>{t('balanceTrendHint')}</p>
          </div>
        </div>
        <ChartContainer config={balanceChartConfig} className='aspect-auto h-56 w-full'>
          <AreaChart data={balanceSeries} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id='walletBalanceGrad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-balance)' stopOpacity={0.35} />
                <stop offset='95%' stopColor='var(--color-balance)' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='date'
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval='preserveStartEnd'
            />
            <YAxis
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatWalletChartAxis}
              width={56}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator='line'
                  formatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <Area
              type='monotone'
              dataKey='balance'
              stroke='var(--color-balance)'
              strokeWidth={2.5}
              fill='url(#walletBalanceGrad)'
              dot={{ r: 3, fill: 'var(--color-balance)', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className='bg-card border-border rounded-2xl border p-4 sm:p-5 lg:col-span-2'>
        <div className='mb-4'>
          <h3 className='font-display text-lg font-semibold tracking-tight'>{t('cashFlow')}</h3>
          <p className='text-muted-foreground text-sm'>{t('cashFlowHint')}</p>
        </div>
        {hasActivity ? (
          <ChartContainer config={activityChartConfig} className='aspect-auto h-56 w-full'>
            <BarChart data={activitySeries} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='date'
                tick={{ fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                interval='preserveStartEnd'
              />
              <YAxis
                tick={{ fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatWalletChartAxis}
                width={52}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator='dot'
                    formatter={(value, name) => (
                      <>
                        <span className='text-muted-foreground'>{String(name)}</span>
                        <span className='text-foreground ms-auto font-mono font-medium tabular-nums'>
                          {formatCurrency(Number(value))}
                        </span>
                      </>
                    )}
                  />
                }
              />
              <Bar
                dataKey='inflow'
                fill='var(--color-inflow)'
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey='outflow'
                fill='var(--color-outflow)'
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className='bg-muted/40 text-muted-foreground flex h-56 items-center justify-center rounded-xl text-sm'>
            {t('chartEmpty')}
          </div>
        )}
      </div>
    </div>
  );
}
