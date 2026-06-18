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
  getCollectionsFromListResponse,
  getCollectionsTotalFromListResponse
} from '@/domains/collections-admin/lib/collection-list';
import { collectionColumns } from '@/domains/collections-admin/sections/collection-columns';
import { deleteCollectionsId } from '@/services/-collections-{id}-delete';
import { getGetCollectionsQueryKey, useGetCollections } from '@/services/-collections-get';
import type { DtoCollectionResponse, GetCollections200 } from '@/services/-collections-get.schemas';

export function CollectionsAdminDomain() {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      page: state.pagination.pageIndex + 1,
      search: filter || undefined
    }),
    []
  );

  const getRows = useCallback(
    (data: GetCollections200 | undefined) => getCollectionsFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetCollections200 | undefined) => getCollectionsTotalFromListResponse(data),
    []
  );

  const serverTable = useServerTable({
    columns: collectionColumns,
    initialPageSize: 15,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetCollections
  });

  const handleDelete = useCallback(
    async (collection: DtoCollectionResponse) => {
      if (!collection.id) return;

      const confirmed = window.confirm(`Delete collection "${collection.title ?? 'this collection'}"?`);
      if (!confirmed) return;

      try {
        await deleteCollectionsId(collection.id);
        void queryClient.invalidateQueries({ queryKey: getGetCollectionsQueryKey() });
        toast.success('Collection deleted');
      } catch (error) {
        toast.error('Failed to delete collection', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    },
    [queryClient]
  );

  const handleBulkDelete = useCallback(async () => {
    const ids = Object.entries(serverTable.tableState.rowSelection)
      .filter(([, selected]) => selected)
      .map(([id]) => Number(id))
      .filter((id) => Number.isFinite(id));

    if (ids.length === 0) {
      toast.error('Select at least one collection');
      return;
    }

    const confirmed = window.confirm(`Delete ${ids.length} selected collection(s)?`);
    if (!confirmed) return;

    try {
      await Promise.all(ids.map((id) => deleteCollectionsId(id)));
      void queryClient.invalidateQueries({ queryKey: getGetCollectionsQueryKey() });
      serverTable.tableState.resetRowSelection();
      toast.success('Selected collections deleted');
    } catch (error) {
      toast.error('Failed to delete selected collections', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  }, [queryClient, serverTable.tableState]);

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search by title, slug, or eyebrow'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => push('/dashboard/collections/create')}
        showClear
        showColumnVisibility
        showBulkActions
        onDelete={handleBulkDelete}
      />
      <Table.Grid<DtoCollectionResponse>
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        onRowDoubleClick={(row) => {
          const id = row.original.id;
          if (id) push(`/dashboard/collections/edit/${id}`);
        }}
        extendMenuActions={(row) => (
          <>
            <DropdownMenuItem
              className='gap-2 text-[11px] font-semibold'
              onClick={() => push(`/dashboard/collections/edit/${row.original.id}`)}
            >
              <IconPencil className='size-3.5' />
              Edit collection
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive gap-2 text-[11px] font-semibold'
              onClick={() => void handleDelete(row.original)}
            >
              <IconTrash className='size-3.5' />
              Delete collection
            </DropdownMenuItem>
          </>
        )}
      />
      <Table.Pagination
        showPageSize
        showTotalRows
        showJumpToPage
        pageSizeOptions={[10, 15, 20, 50, 100]}
      />
    </Table.Root>
  );
}
