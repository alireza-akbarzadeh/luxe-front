'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { useInvalidateCalendar } from '@/domains/store-calendar/hooks/use-invalidate-calendar';
import { getDayTypeStyle } from '@/domains/store-calendar/lib/calendar-day-styles';
import { useStoreCalendarStore } from '@/domains/store-calendar/stores/store-calendar-store';
import { useGetAdminCalendarDayDate } from '@/services/-admin-calendar-day-{date}-get';
import type { DtoStoreHolidayResponse } from '@/services/-admin-calendar-day-{date}-get.schemas';
import { deleteAdminCalendarHolidaysId } from '@/services/-admin-calendar-holidays-{id}-delete';

/** Right-side detail drawer for a single calendar day — holidays, schedule, and quick edit/delete. */
export function CalendarDayDrawer() {
  const drawerOpen = useStoreCalendarStore((state) => state.drawerOpen);
  const selectedDate = useStoreCalendarStore((state) => state.selectedDate);
  const closeDrawer = useStoreCalendarStore((state) => state.closeDrawer);
  const invalidateCalendar = useInvalidateCalendar();

  const { data, isLoading } = useGetAdminCalendarDayDate(selectedDate, undefined, {
    query: { enabled: drawerOpen && Boolean(selectedDate) }
  });

  const detail = data?.data;
  const style = getDayTypeStyle(detail?.day_type);
  const dateLabel = selectedDate ? format(new Date(`${selectedDate}T00:00:00`), 'EEEE, MMMM d, yyyy') : '';

  const handleDelete = async (holiday: DtoStoreHolidayResponse) => {
    if (!holiday.id) return;
    if (!window.confirm(`Delete holiday "${holiday.name ?? 'this holiday'}"?`)) return;

    try {
      await deleteAdminCalendarHolidaysId(holiday.id);
      invalidateCalendar(selectedDate);
      toast.success('Holiday deleted');
    } catch (error) {
      toast.error('Failed to delete holiday', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  };

  return (
    <Sheet open={drawerOpen} onOpenChange={(open) => (open ? undefined : closeDrawer())}>
      <SheetContent className='w-full overflow-y-auto sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>{dateLabel || 'Day details'}</SheetTitle>
          <SheetDescription>Holidays, off days, and working schedule for this date</SheetDescription>
        </SheetHeader>

        <Flex direction='column' spacing={5} className='mt-4 px-1'>
          {isLoading ? (
            <Flex direction='column' spacing={3}>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-24 w-full' />
            </Flex>
          ) : (
            <>
              <Flex direction='row' align='center' spacing={2}>
                <Badge className={style.badge} variant='outline'>
                  {style.label}
                </Badge>
                {detail?.is_working_day === false && <Badge variant='destructive'>Non-working</Badge>}
              </Flex>

              <Flex direction='column' spacing={2}>
                <Typography.Overline>Holidays</Typography.Overline>
                {!detail?.holidays?.length ? (
                  <Typography.Muted className='text-sm'>No holidays on this date</Typography.Muted>
                ) : (
                  detail.holidays.map((holiday) => (
                    <Flex
                      key={holiday.id}
                      direction='column'
                      spacing={2}
                      className='rounded-lg border p-3'
                    >
                      <Flex direction='row' align='start' justify='between'>
                        <Flex direction='column'>
                          <Typography.Text className='text-sm font-medium'>{holiday.name}</Typography.Text>
                          {holiday.description && (
                            <Typography.Muted className='text-xs'>{holiday.description}</Typography.Muted>
                          )}
                        </Flex>
                        <Badge variant={holiday.status === 'published' ? 'default' : 'secondary'}>
                          {holiday.status === 'published' ? 'Published' : 'Draft'}
                        </Badge>
                      </Flex>
                      <Flex direction='row' spacing={2}>
                        <Button variant='outline' size='sm' asChild>
                          <Link href={`/dashboard/calendar/holidays/edit/${holiday.id}`}>Edit</Link>
                        </Button>
                        <Button variant='outline' size='sm' onClick={() => void handleDelete(holiday)}>
                          Delete
                        </Button>
                      </Flex>
                    </Flex>
                  ))
                )}
              </Flex>

              {detail?.off_days?.length ? (
                <Flex direction='column' spacing={2}>
                  <Typography.Overline>Vendor off days</Typography.Overline>
                  {detail.off_days.map((offDay) => (
                    <Flex key={offDay.id} direction='column' className='rounded-lg border p-3'>
                      <Typography.Text className='text-sm font-medium'>
                        {offDay.title || offDay.off_type || 'Off day'}
                      </Typography.Text>
                      {offDay.notes && <Typography.Muted className='text-xs'>{offDay.notes}</Typography.Muted>}
                    </Flex>
                  ))}
                </Flex>
              ) : null}

              {detail?.schedule ? (
                <Flex direction='column' spacing={2}>
                  <Typography.Overline>Working schedule</Typography.Overline>
                  <Typography.Muted className='text-sm'>
                    {detail.schedule.open_time ?? '—'} – {detail.schedule.close_time ?? '—'}
                    {detail.schedule.timezone ? ` (${detail.schedule.timezone})` : ''}
                  </Typography.Muted>
                </Flex>
              ) : null}

              <Separator />

              <Button variant='outline' asChild>
                <Link href='/dashboard/calendar/holidays'>View All Holidays</Link>
              </Button>
            </>
          )}
        </Flex>
      </SheetContent>
    </Sheet>
  );
}
