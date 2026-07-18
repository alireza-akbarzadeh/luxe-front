'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { StoreSelect } from '@/domains/store-calendar/components/store-select';
import { useGetAdminCalendarSchedules } from '@/services/-admin-calendar-schedules-get';

const WEEKDAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/** Read-only overview of per-store working schedules. Full editor is a future iteration. */
export function SchedulesDomain() {
  const [storeId, setStoreId] = useState<number | null>(null);

  const { data, isLoading } = useGetAdminCalendarSchedules({ store_id: storeId ?? undefined });
  const schedules = data?.data ?? [];

  return (
    <Flex direction='column' spacing={6}>
      <Flex direction='row' align='center' justify='between' wrap='wrap' spacing={3}>
        <Flex direction='column' spacing={1}>
          <Typography.H2>Working Schedules</Typography.H2>
          <Typography.Muted>Per-store open hours, breaks, and delivery capacity limits</Typography.Muted>
        </Flex>
        <StoreSelect value={storeId} onChange={setStoreId} className='w-56' />
      </Flex>

      {isLoading ? (
        <Grid cols={1} gap={4} className='sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className='h-40 w-full rounded-xl' />
          ))}
        </Grid>
      ) : schedules.length === 0 ? (
        <Flex align='center' justify='center' className='h-48 rounded-lg border border-dashed'>
          <Typography.Muted>No working schedules configured yet</Typography.Muted>
        </Flex>
      ) : (
        <Grid cols={1} gap={4} className='sm:grid-cols-2 lg:grid-cols-3'>
          {schedules.map((schedule) => {
            const activeDays = WEEKDAY_ORDER.filter((day) => schedule.working_days?.[day]);
            return (
              <Card key={schedule.id}>
                <CardHeader>
                  <CardTitle className='text-base'>Store #{schedule.store_id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Flex direction='column' spacing={3}>
                    <Flex direction='row' align='center' justify='between'>
                      <Typography.Muted className='text-xs'>Hours</Typography.Muted>
                      <Typography.Text className='text-sm font-medium'>
                        {schedule.open_time ?? '—'} – {schedule.close_time ?? '—'}
                      </Typography.Text>
                    </Flex>
                    <Flex direction='row' align='center' justify='between'>
                      <Typography.Muted className='text-xs'>Working days</Typography.Muted>
                      <Typography.Text className='text-sm font-medium uppercase'>
                        {activeDays.length > 0 ? activeDays.join(', ') : '—'}
                      </Typography.Text>
                    </Flex>
                    <Flex direction='row' align='center' justify='between'>
                      <Typography.Muted className='text-xs'>Max orders / day</Typography.Muted>
                      <Typography.Text className='text-sm font-medium'>
                        {schedule.max_orders_per_day ?? '—'}
                      </Typography.Text>
                    </Flex>
                    <Flex direction='row' align='center' justify='between'>
                      <Typography.Muted className='text-xs'>Max deliveries / day</Typography.Muted>
                      <Typography.Text className='text-sm font-medium'>
                        {schedule.max_deliveries_per_day ?? '—'}
                      </Typography.Text>
                    </Flex>
                    <Flex direction='row' align='center' justify='between'>
                      <Typography.Muted className='text-xs'>Delivery buffer</Typography.Muted>
                      <Typography.Text className='text-sm font-medium'>
                        {schedule.delivery_buffer_hours ?? 0}h
                      </Typography.Text>
                    </Flex>
                  </Flex>
                </CardContent>
              </Card>
            );
          })}
        </Grid>
      )}
    </Flex>
  );
}
