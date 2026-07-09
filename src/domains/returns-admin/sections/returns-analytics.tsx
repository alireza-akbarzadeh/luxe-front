'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/typography';
import { ReturnTypeBadge } from '@/domains/returns-admin/components/return-type-badge';
import { formatCurrency } from '@/lib/format';
import { useGetAdminReturnsStats } from '@/services/-admin-returns-stats-get';

const volumeChartConfig = {
  count: {
    label: 'Returns',
    color: 'hsl(var(--primary))'
  }
} satisfies ChartConfig;

function formatChartDate(value?: string) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function ReturnsAnalytics() {
  const { data, isLoading, isError } = useGetAdminReturnsStats();

  const stats = data?.data;

  if (isLoading) {
    return (
      <div className='grid gap-4 lg:grid-cols-3'>
        <Skeleton className='h-56 rounded-2xl lg:col-span-2' />
        <Skeleton className='h-56 rounded-2xl' />
      </div>
    );
  }

  if (isError || !stats) {
    return null;
  }

  const chartData = (stats.last_7_days ?? []).map((point) => ({
    date: formatChartDate(point.date),
    count: point.count ?? 0
  }));

  const statusEntries = Object.entries(stats.by_status ?? {}).toSorted((a, b) => b[1] - a[1]);
  const typeEntries = Object.entries(stats.by_type ?? {});

  return (
    <div className='grid gap-4 lg:grid-cols-3'>
      <div className='bg-card border-border/40 rounded-2xl border p-5 shadow-sm lg:col-span-2'>
        <Flex direction='column' className='mb-4 gap-1'>
          <Text variant='small' as='h2'>
            Return volume
          </Text>
          <Text variant='muted'>New requests in the last 7 days</Text>
        </Flex>
        <ChartContainer config={volumeChartConfig} className='aspect-auto h-48 w-full'>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
            barSize={24}
          >
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis dataKey='date' tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dashed' />} />
            <Bar dataKey='count' fill='var(--color-count)' radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className='bg-card border-border/40 space-y-5 rounded-2xl border p-5 shadow-sm'>
        <Flex direction='column' className='gap-1'>
          <Text variant='small' as='h2'>
            Summary
          </Text>
          <Text variant='muted'>Refund vs exchange breakdown</Text>
        </Flex>

        <Flex direction='column' className='gap-2'>
          <Flex justify='between' align='center'>
            <Text variant='muted'>Total returns</Text>
            <Text variant='large'>{stats.total?.toLocaleString() ?? '0'}</Text>
          </Flex>
          <Flex justify='between' align='center'>
            <Text variant='muted'>Open pipeline</Text>
            <Text variant='large'>{stats.open?.toLocaleString() ?? '0'}</Text>
          </Flex>
          <Flex justify='between' align='center'>
            <Text variant='muted'>Refunded amount</Text>
            <Text variant='large'>{formatCurrency(stats.refund_total ?? 0)}</Text>
          </Flex>
        </Flex>

        <Flex direction='column' className='gap-2'>
          <Text variant='overline' className='text-muted-foreground'>
            By type
          </Text>
          {typeEntries.length === 0 ? (
            <Text variant='muted'>No data yet</Text>
          ) : (
            typeEntries.map(([type, count]) => (
              <Flex key={type} justify='between' align='center'>
                <ReturnTypeBadge returnType={type} />
                <Text variant='small'>{count.toLocaleString()}</Text>
              </Flex>
            ))
          )}
        </Flex>

        <Flex direction='column' className='gap-2'>
          <Text variant='overline' className='text-muted-foreground'>
            Top statuses
          </Text>
          {statusEntries.slice(0, 5).map(([status, count]) => (
            <Flex key={status} justify='between' align='center'>
              <Text variant='muted' className='capitalize'>
                {status.replaceAll('_', ' ')}
              </Text>
              <Text variant='small'>{count.toLocaleString()}</Text>
            </Flex>
          ))}
        </Flex>
      </div>
    </div>
  );
}
