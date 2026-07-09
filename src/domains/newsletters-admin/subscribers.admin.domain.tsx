'use client';

import { IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import {
  getSubscribersFromList,
  getSubscribersTotal
} from '@/domains/newsletters-admin/lib/email-marketing-list';
import { subscriberColumns } from '@/domains/newsletters-admin/sections/subscriber-columns';
import { deleteAdminNewsletterSubscribersId } from '@/services/-admin-newsletter-subscribers-{id}-delete';
import { getAdminNewsletterSubscribersExport } from '@/services/-admin-newsletter-subscribers-export-get';
import {
  getGetAdminNewsletterSubscribersQueryKey,
  useGetAdminNewsletterSubscribers
} from '@/services/-admin-newsletter-subscribers-get';
import type {
  DtoSubscriberListResponse,
  ModelsNewsletterSubscriber
} from '@/services/-admin-newsletter-subscribers-get.schemas';

export function SubscribersAdminDomain() {
  const queryClient = useQueryClient();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      search: filter || undefined,
      status: 'all'
    }),
    []
  );

  const serverTable = useServerTable({
    columns: subscriberColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows: (data: DtoSubscriberListResponse | undefined) => getSubscribersFromList(data),
    getTotal: (data: DtoSubscriberListResponse | undefined) => getSubscribersTotal(data),
    useQuery: useGetAdminNewsletterSubscribers
  });

  const handleExport = useCallback(async () => {
    try {
      const csv = await getAdminNewsletterSubscribersExport({ status: 'all' });
      const blob = new Blob([typeof csv === 'string' ? csv : JSON.stringify(csv)], {
        type: 'text/csv'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'newsletter-subscribers.csv';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Export started');
    } catch {
      toast.error('Failed to export subscribers');
    }
  }, []);

  const handleDelete = useCallback(
    async (subscriber: ModelsNewsletterSubscriber) => {
      if (!subscriber.id) return;
      if (!window.confirm(`Remove subscriber ${subscriber.email}?`)) return;
      try {
        await deleteAdminNewsletterSubscribersId(subscriber.id);
        void queryClient.invalidateQueries({
          queryKey: getGetAdminNewsletterSubscribersQueryKey()
        });
        toast.success('Subscriber removed');
      } catch {
        toast.error('Failed to remove subscriber');
      }
    },
    [queryClient]
  );

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search subscribers…'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showClear
        showColumnVisibility
        showExport={false}
      >
        <Button variant='outline' size='sm' onClick={() => void handleExport()}>
          Export CSV
        </Button>
      </Table.Toolbar>
      <Table.Grid<ModelsNewsletterSubscriber>
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        extendMenuActions={(row) => (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive'
              onClick={() => void handleDelete(row.original)}
            >
              <IconTrash className='size-3.5' /> Remove
            </DropdownMenuItem>
          </>
        )}
      />
      <Table.Pagination showPageSize showTotalRows />
    </Table.Root>
  );
}
