'use client';

import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import {
  getFlashDealsFromList,
  getFlashDealsTotal
} from '@/domains/promotions-admin/lib/promotion-list';
import { flashDealColumns } from '@/domains/promotions-admin/sections/flash-deal-columns';
import { deleteAdminFlashDealsId } from '@/services/-admin-flash-deals-{id}-delete';
import {
  getGetAdminFlashDealsQueryKey,
  useGetAdminFlashDeals
} from '@/services/-admin-flash-deals-get';
import type {
  DtoFlashDealListResponse,
  ModelsFlashDeal
} from '@/services/-admin-flash-deals-get.schemas';

export function FlashSalesAdminDomain() {
  const router = useRouter();
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
    columns: flashDealColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows: (data: DtoFlashDealListResponse | undefined) => getFlashDealsFromList(data),
    getTotal: (data: DtoFlashDealListResponse | undefined) => getFlashDealsTotal(data),
    useQuery: useGetAdminFlashDeals
  });

  const handleDelete = useCallback(
    async (deal: ModelsFlashDeal) => {
      if (!deal.id) return;
      if (!window.confirm(`Delete flash sale for product #${deal.product_id}?`)) return;
      try {
        await deleteAdminFlashDealsId(deal.id);
        void queryClient.invalidateQueries({ queryKey: getGetAdminFlashDealsQueryKey() });
        toast.success('Flash sale deleted');
      } catch {
        toast.error('Failed to delete flash sale');
      }
    },
    [queryClient]
  );

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search flash sales…'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => router.push('/dashboard/promotions/flash-sales/create')}
        showClear
        showColumnVisibility
      />
      <Table.Grid<ModelsFlashDeal>
        onRowDoubleClick={(row) =>
          row.original.id &&
          router.push(`/dashboard/promotions/flash-sales/edit/${row.original.id}`)
        }
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        extendMenuActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() =>
                row.original.id &&
                router.push(`/dashboard/promotions/flash-sales/edit/${row.original.id}`)
              }
            >
              <IconPencil className='size-3.5' /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive'
              onClick={() => void handleDelete(row.original)}
            >
              <IconTrash className='size-3.5' /> Delete
            </DropdownMenuItem>
          </>
        )}
      />
      <Table.Pagination showPageSize showTotalRows />
    </Table.Root>
  );
}
