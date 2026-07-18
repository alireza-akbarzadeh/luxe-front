import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import type { DtoStoreStatusTodayResponse } from '@/services/-admin-calendar-stores-status-today-get.schemas';

interface StoresStatusCardProps {
  stores: DtoStoreStatusTodayResponse[];
  isLoading: boolean;
}

/** Per-store working/closed status for today, from `/admin/calendar/stores-status-today`. */
export function StoresStatusCard({ stores, isLoading }: StoresStatusCardProps) {
  const closedCount = stores.filter((store) => !store.is_working_today).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stores Status Today</CardTitle>
        <CardDescription>
          {isLoading
            ? 'Loading…'
            : `${stores.length - closedCount} open · ${closedCount} closed of ${stores.length}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Flex direction='column' spacing={3}>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </Flex>
        ) : stores.length === 0 ? (
          <Flex align='center' justify='center' className='h-32 rounded-lg border border-dashed'>
            <Typography.Muted>No store status available</Typography.Muted>
          </Flex>
        ) : (
          <Flex direction='column' spacing={2} className='max-h-72 overflow-y-auto'>
            {stores.map((store) => (
              <Flex
                key={store.store_id}
                direction='row'
                align='center'
                justify='between'
                className='rounded-lg border px-3 py-2'
              >
                <Flex direction='column'>
                  <Typography.Text className='text-sm font-medium'>
                    {store.store_name || `Store #${store.store_id}`}
                  </Typography.Text>
                  {store.reason && <Typography.Muted className='text-xs'>{store.reason}</Typography.Muted>}
                </Flex>
                {store.is_working_today ? (
                  <IconCircleCheck className='size-5 shrink-0 text-emerald-500' aria-label='Open today' />
                ) : (
                  <IconCircleX className='size-5 shrink-0 text-rose-500' aria-label='Closed today' />
                )}
              </Flex>
            ))}
          </Flex>
        )}
      </CardContent>
    </Card>
  );
}
