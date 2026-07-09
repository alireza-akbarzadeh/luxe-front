'use client';

import { IconFileSpreadsheet, IconFolderSymlink, IconPencil } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { CategoryImportDialog } from '@/domains/categories/components/category-import-dialog';
import { CategoryMobileCard } from '@/domains/categories/components/category-mobile-card';
import { CategoryReparentDialog } from '@/domains/categories/components/category-reparent-dialog';
import { CategoryTreeActions } from '@/domains/categories/components/category-tree-actions';
import { categoryColumns } from '@/domains/categories/sections/category-columns';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { useDeleteAdminCategoriesBulk } from '@/services/-admin-categories-bulk-delete';
import { getGetCategoriesQueryKey, useGetCategories } from '@/services/-categories-get';
import type { DtoCategoryListResponse, ModelsCategory } from '@/services/-categories-get.schemas';

export function CategoriesDomains() {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { isDesktop } = useMediaDevices();
  const [importOpen, setImportOpen] = useState(false);
  const [reparentCategory, setReparentCategory] = useState<ModelsCategory | null>(null);

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

  const allCategories = serverTable.rows;

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

  const openEdit = useCallback(
    (category: ModelsCategory) => {
      if (category.id) push(`/dashboard/categories/edit/${category.id}`);
    },
    [push]
  );

  return (
    <>
      <Table.Root {...serverTable.rootProps} getSubRows={(row) => row.children}>
        <Table.Toolbar
          searchPlaceholder='Search by name or slug'
          showRefresh
          onRefresh={serverTable.refetch}
          isLoading={serverTable.isFetching}
          showCreate
          onCreate={() => push('/dashboard/categories/create')}
          showClear
          showColumnVisibility={isDesktop}
          showBulkActions={isDesktop}
          onDelete={isDesktop ? handleBulkDelete : undefined}
        >
          <CategoryTreeActions />
          {isDesktop ? (
            <Button type='button' variant='outline' size='sm' onClick={() => setImportOpen(true)}>
              <IconFileSpreadsheet className='size-4' />
              Import Excel
            </Button>
          ) : null}
        </Table.Toolbar>

        {!isDesktop ? (
          <Flex
            direction='row'
            align='center'
            justify='between'
            className='border-border/40 bg-background/50 border-b px-4 py-3'
          >
            <Text variant='muted' className='text-[10px] font-bold tracking-widest uppercase'>
              {serverTable.total.toLocaleString()} categories
            </Text>
            <Text variant='muted' className='text-[10px]'>
              Tap to edit
            </Text>
          </Flex>
        ) : null}

        {isDesktop ? (
          <Table.Grid<ModelsCategory>
            onRowDoubleClick={(row) => openEdit(row.original)}
            isLoading={serverTable.isLoading && serverTable.rows.length === 0}
            extendMenuActions={(row) => (
              <>
                <DropdownMenuItem
                  className='gap-2 text-[11px] font-semibold'
                  onClick={() => openEdit(row.original)}
                >
                  <IconPencil className='size-3.5' />
                  Edit category
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='gap-2 text-[11px] font-semibold'
                  onClick={() => setReparentCategory(row.original)}
                >
                  <IconFolderSymlink className='size-3.5' />
                  Move category
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
          />
        ) : (
          <Table.MobileList<ModelsCategory>
            isLoading={serverTable.isLoading && serverTable.rows.length === 0}
            renderCard={(row) => <CategoryMobileCard row={row} />}
            onCardClick={(row) => openEdit(row.original)}
          />
        )}

        <Table.Pagination
          showPageSize
          showTotalRows={isDesktop}
          showJumpToPage={isDesktop}
          pageSizeOptions={[10, 20, 50, 100, 200]}
        />
      </Table.Root>

      <CategoryImportDialog open={importOpen} onOpenChange={setImportOpen} />

      <CategoryReparentDialog
        category={reparentCategory}
        allCategories={allCategories}
        open={reparentCategory != null}
        onOpenChange={(open) => {
          if (!open) setReparentCategory(null);
        }}
      />
    </>
  );
}
