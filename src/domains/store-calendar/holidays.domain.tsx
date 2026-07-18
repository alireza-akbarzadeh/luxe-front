'use client';

import { IconCopy, IconEye, IconSend, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useInvalidateCalendar } from '@/domains/store-calendar/hooks/use-invalidate-calendar';
import { getHolidaysFromListResponse, getHolidaysTotalFromListResponse } from '@/domains/store-calendar/lib/calendar-list';
import { holidayColumns } from '@/domains/store-calendar/sections/holiday-columns';
import { deleteAdminCalendarHolidaysId } from '@/services/-admin-calendar-holidays-{id}-delete';
import { postAdminCalendarHolidaysIdDuplicate } from '@/services/-admin-calendar-holidays-{id}-duplicate-post';
import { postAdminCalendarHolidaysIdPublish } from '@/services/-admin-calendar-holidays-{id}-publish-post';
import { useGetAdminCalendarHolidays } from '@/services/-admin-calendar-holidays-get';
import type {
  DtoStoreHolidayListResponse,
  DtoStoreHolidayResponse
} from '@/services/-admin-calendar-holidays-get.schemas';

/** Server-paginated holidays table with view/edit/duplicate/publish/delete row actions. */
export function HolidaysDomain() {
  const { push } = useRouter();
  const invalidateCalendar = useInvalidateCalendar();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      page: state.pagination.pageIndex + 1,
      search: filter || undefined
    }),
    []
  );

  const getRows = useCallback(
    (data: DtoStoreHolidayListResponse | undefined) => getHolidaysFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: DtoStoreHolidayListResponse | undefined) => getHolidaysTotalFromListResponse(data) ?? 0,
    []
  );

  const serverTable = useServerTable({
    columns: holidayColumns,
    initialPageSize: 15,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetAdminCalendarHolidays
  });

  const handleDelete = useCallback(
    async (holiday: DtoStoreHolidayResponse) => {
      if (!holiday.id) return;
      if (!window.confirm(`Delete holiday "${holiday.name ?? 'this holiday'}"?`)) return;

      try {
        await deleteAdminCalendarHolidaysId(holiday.id);
        invalidateCalendar();
        toast.success('Holiday deleted');
      } catch (error) {
        toast.error('Failed to delete holiday', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    },
    [invalidateCalendar]
  );

  const handleDuplicate = useCallback(
    async (holiday: DtoStoreHolidayResponse) => {
      if (!holiday.id) return;
      try {
        await postAdminCalendarHolidaysIdDuplicate(holiday.id);
        invalidateCalendar();
        toast.success('Holiday duplicated');
      } catch (error) {
        toast.error('Failed to duplicate holiday', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    },
    [invalidateCalendar]
  );

  const handlePublish = useCallback(
    async (holiday: DtoStoreHolidayResponse) => {
      if (!holiday.id) return;
      try {
        await postAdminCalendarHolidaysIdPublish(holiday.id);
        invalidateCalendar();
        toast.success('Holiday published');
      } catch (error) {
        toast.error('Failed to publish holiday', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    },
    [invalidateCalendar]
  );

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search holidays by name or description'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => push('/dashboard/calendar/holidays/create')}
        showClear
        showColumnVisibility
      />

      <Table.Grid<DtoStoreHolidayResponse>
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        onRowDoubleClick={(row) => {
          const id = row.original.id;
          if (id) push(`/dashboard/calendar/holidays/edit/${id}`);
        }}
        extendMenuActions={(row) => (
          <>
            <DropdownMenuItem
              className='gap-2'
              onClick={() => push(`/dashboard/calendar/holidays/edit/${row.original.id}`)}
            >
              <IconEye className='size-3.5' />
              View / Edit
            </DropdownMenuItem>
            <DropdownMenuItem className='gap-2' onClick={() => void handleDuplicate(row.original)}>
              <IconCopy className='size-3.5' />
              Duplicate
            </DropdownMenuItem>
            {row.original.status !== 'published' && (
              <DropdownMenuItem className='gap-2' onClick={() => void handlePublish(row.original)}>
                <IconSend className='size-3.5' />
                Publish
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive gap-2'
              onClick={() => void handleDelete(row.original)}
            >
              <IconTrash className='size-3.5' />
              Delete
            </DropdownMenuItem>
          </>
        )}
      />

      <Table.Pagination />
    </Table.Root>
  );
}
