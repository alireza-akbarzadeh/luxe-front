import { IconCalendarEvent } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { getDayTypeStyle } from '@/domains/store-calendar/lib/calendar-day-styles';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import type { DtoUpcomingEventResponse } from '@/services/-admin-calendar-upcoming-events-get.schemas';

interface UpcomingEventsCardProps {
  events: DtoUpcomingEventResponse[];
  isLoading: boolean;
}

/** Next holidays/off-days pulled from `/admin/calendar/upcoming-events`. */
export function UpcomingEventsCard({ events, isLoading }: UpcomingEventsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Next holidays and closures across all stores</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Flex direction='column' spacing={3}>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
          </Flex>
        ) : events.length === 0 ? (
          <Flex align='center' justify='center' className='h-32 rounded-lg border border-dashed'>
            <Typography.Muted>No upcoming events</Typography.Muted>
          </Flex>
        ) : (
          <Flex direction='column' spacing={2}>
            {events.map((event) => {
              const style = getDayTypeStyle(event.type);
              return (
                <Flex key={event.id} direction='row' align='center' justify='between' spacing={3}>
                  <Flex direction='row' align='center' spacing={2}>
                    <Flex
                      align='center'
                      justify='center'
                      className={cn('size-8 shrink-0 rounded-full border', style.badge)}
                    >
                      <IconCalendarEvent className='size-4 text-current' />
                    </Flex>
                    <Flex direction='column'>
                      <Typography.Text className='text-sm font-medium'>
                        {event.title || 'Untitled event'}
                      </Typography.Text>
                      <Typography.Muted className='text-xs'>
                        {event.start_date ? formatDate(event.start_date, DATE_FORMATS.SHORT) : '—'}
                        {event.scope ? ` · ${event.scope}` : ''}
                      </Typography.Muted>
                    </Flex>
                  </Flex>
                  <Badge variant='outline' className='shrink-0'>
                    {style.label}
                  </Badge>
                </Flex>
              );
            })}
          </Flex>
        )}
      </CardContent>
    </Card>
  );
}
