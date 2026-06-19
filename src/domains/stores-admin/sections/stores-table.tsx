'use client';

import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import {
  getStoresFromListResponse,
  getStoresTotalFromListResponse
} from '@/domains/stores-admin/lib/store-list';
import { storeColumns } from '@/domains/stores-admin/sections/store-columns';
import { deleteStoresId } from '@/services/-stores-{id}-delete';
import { getGetStoresQueryKey, useGetStores } from '@/services/-stores-get';
import type { DtoStoreResponse, GetStores200 } from '@/services/-stores-get.schemas';

export function StoresTable() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      search: filter || undefined,
      sort_by: 'newest' as const
    }),
    []
  );

  const getRows = useCallback(
    (data: GetStores200 | undefined) => getStoresFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetStores200 | undefined) => getStoresTotalFromListResponse(data),
    []
  );

  const serverTable = useServerTable({
    columns: storeColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetStores
  });

  const invalidateList = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: getGetStoresQueryKey() });
  }, [queryClient]);

  const openEdit = useCallback(
    (id: number) => {
      router.push(`/dashboard/stores/edit/${id}`);
    },
    [router]
  );

  const handleDeleteStore = useCallback(
    async (store: DtoStoreResponse) => {
      if (!store.id) return;

      const confirmed = window.confirm(`Delete store "${store.name ?? 'this store'}"?`);
      if (!confirmed) return;

      try {
        await deleteStoresId(store.id);
        invalidateList();
        toast.success('Store deleted');
      } catch (error) {
        toast.error('Failed to delete store', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    },
    [invalidateList]
  );

  const handleBulkDelete = useCallback(async () => {
    const ids = Object.entries(serverTable.tableState.rowSelection)
      .filter(([, selected]) => selected)
      .map(([id]) => Number(id))
      .filter((id) => Number.isFinite(id));

    if (ids.length === 0) {
      toast.error('Select at least one store');
      return;
    }

    const confirmed = window.confirm(`Delete ${ids.length} selected store(s)?`);
    if (!confirmed) return;

    try {
      await Promise.all(ids.map((id) => deleteStoresId(id)));
      invalidateList();
      serverTable.tableState.resetRowSelection();
      toast.success('Selected stores deleted');
    } catch (error) {
      toast.error('Failed to delete selected stores', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  }, [invalidateList, serverTable.tableState]);

  if (serverTable.isError) {
    return (
      <div className='rounded-xl border border-dashed p-12 text-center'>
        <p className='text-lg font-semibold'>Stores unavailable</p>
        <p className='text-muted-foreground mt-1 text-sm'>Check your connection and try again.</p>
        <Button className='mt-4' variant='outline' onClick={() => serverTable.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search by name or description…'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => router.push('/dashboard/stores/create')}
        showClear
        showColumnVisibility
        showBulkActions
        onDelete={handleBulkDelete}
      />

      <Table.Grid<DtoStoreResponse>
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        onRowDoubleClick={(row) => row.original.id && openEdit(row.original.id)}
        extendMenuActions={(row) => (
          <>
            <DropdownMenuItem
              className='gap-2 text-[11px] font-semibold'
              onClick={() => row.original.id && openEdit(row.original.id)}
            >
              <IconPencil className='size-3.5' />
              Edit store
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive gap-2 text-[11px] font-semibold'
              onClick={() => void handleDeleteStore(row.original)}
            >
              <IconTrash className='size-3.5' />
              Delete store
            </DropdownMenuItem>
          </>
        )}
      />

      <Table.Pagination
        showPageSize
        showTotalRows
        showJumpToPage
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </Table.Root>
  );
}
