'use client';

import { IconFileSpreadsheet } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useDeferredValue, useState } from 'react';
import { toast } from 'sonner';

import { Table, useTableState } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { buildCategoryTree } from '@/domains/categories/categories.util';
import { CategoryImportDialog } from '@/domains/categories/components/category-import-dialog';
import { categoryColumns } from '@/domains/categories/sections/category-columns';
import { useDeleteAdminCategoriesBulk } from '@/services/-admin-categories-bulk-delete';
import { getGetCategoriesQueryKey,useGetCategories } from '@/services/-categories-get';
import type { ModelsCategory } from '@/services/-categories-get.schemas';

export function CategoriesDomains() {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const tableState = useTableState();
  const deferredFilter = useDeferredValue(tableState.globalFilter);
  const [importOpen, setImportOpen] = useState(false);

  const { data, isLoading, isFetching, refetch } = useGetCategories({
    search: deferredFilter || undefined,
    limit: 100
  });

  const flatCategories = data?.data?.categories ?? [];
  const treeData = buildCategoryTree(flatCategories);

  const deleteBulkMutation = useDeleteAdminCategoriesBulk({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
        toast.success('Categories deleted');
      }
    }
  });

  const handleBulkDelete = useCallback(() => {
    const ids = Object.entries(tableState.rowSelection)
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
          tableState.resetRowSelection();
        }
      }
    );
  }, [deleteBulkMutation, tableState]);

  return (
    <>
      <Table.Root
        data={treeData}
        columns={categoryColumns}
        tableState={tableState}
        getSubRows={(row: ModelsCategory) => row.children}
      >
        <Table.Toolbar
          searchPlaceholder='Search by name or slug'
          showRefresh
          onRefresh={refetch}
          isLoading={isFetching}
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
          isLoading={isLoading}
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
