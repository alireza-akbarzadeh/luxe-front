'use client';

import { IconFileSpreadsheet } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { CategoryImportDialog } from '@/domains/categories/components/category-import-dialog';
import { categoryColumns } from '@/domains/categories/sections/category-columns';
import { useDeleteAdminCategoriesBulk } from '@/services/-admin-categories-bulk-delete';
import { getGetCategoriesQueryKey, useGetCategories } from '@/services/-categories-get';
import type { DtoCategoryListResponse, ModelsCategory } from '@/services/-categories-get.schemas';

export function CategoriesDomains() {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const [importOpen, setImportOpen] = useState(false);

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      search: filter || undefined
    }),
    []
  );

  const getRows = useCallback(
    (data: DtoCategoryListResponse | undefined) => data?.data?.categories ?? [],
    []
  );

  const getTotal = useCallback(
    (data: DtoCategoryListResponse | undefined) => data?.data?.total,
    []
  );

  const deleteBulkMutation = useDeleteAdminCategoriesBulk({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
        toast.success('Categories deleted');
      }
    }
  });

  const serverTable = useServerTable({
    columns: categoryColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetCategories
  });

  const handleBulkDelete = useCallback(() => {
    const ids = Object.entries(serverTable.tableState.rowSelection)
      .filter(([, selected]) => selected)
      .map(([id]) => Number(id))
      .filter((id) => Number.isFinite(id));

    if (ids.length === 0) {
      toast.error('Select at least one category');
      return;
    }

    deleteBulkMutation.mutate(
      { data: { ids } as { ids: number[] } },
      {
        onSuccess: () => {
          serverTable.tableState.resetRowSelection();
        }
      }
    );
  }, [deleteBulkMutation, serverTable.tableState]);

  return (
    <>
      <Table.Root {...serverTable.rootProps}>
        <Table.Toolbar
          searchPlaceholder='Search by name or slug'
          showRefresh
          onRefresh={serverTable.refetch}
          isLoading={serverTable.isFetching}
          showCreate
          onCreate={() => push('/dashboard/categories/create')}
          showClear
          showColumnVisibility
          showBulkActions
          onDelete={handleBulkDelete}
        >
          <Button type='button' variant='outline' size='sm' onClick={() => setImportOpen(true)}>
            <IconFileSpreadsheet className='size-4' />
            Import Excel
          </Button>
        </Table.Toolbar>
        <Table.Grid<ModelsCategory>
          onRowDoubleClick={(row) => push(`/dashboard/categories/edit/${row.original.id}`)}
          isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        />
        <Table.Pagination
          showPageSize
          showTotalRows
          showJumpToPage
          pageSizeOptions={[10, 20, 50, 100, 200]}
        />
      </Table.Root>

      <CategoryImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
}
