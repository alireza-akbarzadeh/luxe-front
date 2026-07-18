import type { TablerIcon } from '@tabler/icons-react';
import {
  IconAlertTriangle,
  IconBuildingStore,
  IconCalendarEvent,
  IconClockPause,
  IconGauge,
  IconStar
} from '@tabler/icons-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { DtoCalendarSummaryResponse } from '@/services/-admin-calendar-summary-get.schemas';

interface CalendarKpiCardsProps {
  summary: DtoCalendarSummaryResponse | undefined;
  isLoading: boolean;
}

interface KpiItem {
  label: string;
  value: string;
  hint?: string;
  icon: TablerIcon;
  iconBg: string;
  iconText: string;
}

function percentOf(part: number | undefined, total: number | undefined): string | undefined {
  if (!part || !total) return undefined;
  return `${Math.round((part / total) * 100)}% of total`;
}

function KpiCard({ item }: { item: KpiItem }) {
  return (
    <Card className='rounded-xl transition-shadow hover:shadow-md'>
      <CardHeader className='pb-0'>
        <Flex direction='row' align='center' justify='between'>
          <Typography.Overline>{item.label}</Typography.Overline>
          <Flex align='center' justify='center' className={cn('size-9 rounded-xl', item.iconBg)}>
            <item.icon className={cn('size-4', item.iconText)} />
          </Flex>
        </Flex>
      </CardHeader>
      <CardContent>
        <Typography.Text variant='h3' numeric>
          {item.value}
        </Typography.Text>
        {item.hint ? <Typography.Muted className='mt-1 text-xs'>{item.hint}</Typography.Muted> : null}
      </CardContent>
    </Card>
  );
}

function KpiSkeleton() {
  return (
    <Card className='rounded-xl'>
      <CardHeader className='pb-0'>
        <Skeleton className='h-4 w-24' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-8 w-16' />
      </CardContent>
    </Card>
  );
}

/** Six summary KPI cards backed by `useGetAdminCalendarSummary`. */
export function CalendarKpiCards({ summary, isLoading }: CalendarKpiCardsProps) {
  if (isLoading || !summary) {
    return (
      <Grid cols={2} gap={4} className='sm:grid-cols-3 xl:grid-cols-6'>
        {Array.from({ length: 6 }).map((_, index) => (
          <KpiSkeleton key={index} />
        ))}
      </Grid>
    );
  }

  const items: KpiItem[] = [
    {
      label: 'Total Stores',
      value: String(summary.total_stores ?? 0),
      icon: IconBuildingStore,
      iconBg: 'bg-slate-500/15',
      iconText: 'text-slate-500'
    },
    {
      label: 'Active Stores',
      value: String(summary.active_stores ?? 0),
      hint: percentOf(summary.active_stores, summary.total_stores),
      icon: IconGauge,
      iconBg: 'bg-emerald-500/15',
      iconText: 'text-emerald-500'
    },
    {
      label: 'Closed Today',
      value: String(summary.closed_today ?? 0),
      hint: percentOf(summary.closed_today, summary.total_stores),
      icon: IconClockPause,
      iconBg: 'bg-rose-500/15',
      iconText: 'text-rose-500'
    },
    {
      label: 'Upcoming Holidays',
      value: String(summary.upcoming_holidays ?? 0),
      icon: IconCalendarEvent,
      iconBg: 'bg-sky-500/15',
      iconText: 'text-sky-500'
    },
    {
      label: 'Next Delivery Delay',
      value: `${summary.next_delivery_delay_days ?? 0}d`,
      hint: 'days from today',
      icon: IconAlertTriangle,
      iconBg: 'bg-amber-500/15',
      iconText: 'text-amber-500'
    },
    {
      label: 'Working Capacity',
      value: `${summary.working_capacity_percent ?? 0}%`,
      icon: IconStar,
      iconBg: 'bg-violet-500/15',
      iconText: 'text-violet-500'
    }
  ];

  return (
    <Grid cols={2} gap={4} className='sm:grid-cols-3 xl:grid-cols-6'>
      {items.map((item) => (
        <KpiCard key={item.label} item={item} />
      ))}
    </Grid>
  );
}
