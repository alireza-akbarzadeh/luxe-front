'use client';

import { IconDownload, IconFileSpreadsheet } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductImportDialog } from '@/domains/product-dashboard/components/product-import-dialog';
import { ProductsGridView } from '@/domains/product-dashboard/components/products-grid-view';
import { ProductsViewToggle } from '@/domains/product-dashboard/components/products-view-toggle';
import { useProductsViewMode } from '@/domains/product-dashboard/hooks/use-products-view-mode';
import { downloadProductsCsv } from '@/domains/product-dashboard/lib/export-products-csv';
import { productColumns } from '@/domains/product-dashboard/sections/product-columns';
import { useDeleteProductsBulk } from '@/services/-products-bulk-delete';
import { getGetProductsQueryKey, useGetProducts } from '@/services/-products-get';
import type { DtoProductWithLike, GetProducts200 } from '@/services/-products-get.schemas';

export function ProductsDomains() {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const [importOpen, setImportOpen] = useState(false);
  const [viewMode] = useProductsViewMode();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      name: filter || undefined
    }),
    []
  );

  const getRows = useCallback((data: GetProducts200 | undefined) => data?.data?.products ?? [], []);

  const getTotal = useCallback((data: GetProducts200 | undefined) => data?.data?.total, []);

  const deleteBulkMutation = useDeleteProductsBulk({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
        toast.success('Products deleted');
      }
    }
  });

  const serverTable = useServerTable({
    columns: productColumns,
    initialPageSize: 15,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetProducts
  });

  const handleBulkDelete = useCallback(() => {
    const productIds = Object.entries(serverTable.tableState.rowSelection)
      .filter(([, selected]) => selected)
      .map(([id]) => Number(id))
      .filter((id) => Number.isFinite(id));

    if (productIds.length === 0) {
      toast.error('Select at least one product');
      return;
    }

    deleteBulkMutation.mutate(
      { data: { product_ids: productIds } },
      {
        onSuccess: () => {
          serverTable.tableState.resetRowSelection();
        }
      }
    );
  }, [deleteBulkMutation, serverTable.tableState]);

  const handleExport = useCallback(() => {
    if (serverTable.rows.length === 0) {
      toast.error('Nothing to export on this page');
      return;
    }
    downloadProductsCsv(
      serverTable.rows,
      `products_page_${serverTable.tableState.pagination.pageIndex + 1}.csv`
    );
    toast.success('Products exported');
  }, [serverTable.rows, serverTable.tableState.pagination.pageIndex]);

  const showInitialLoading = serverTable.isLoading && serverTable.rows.length === 0;

  return (
    <>
      <Table.Root {...serverTable.rootProps}>
        <Table.Toolbar
          searchPlaceholder='Search by name or SKU'
          showRefresh
          onRefresh={serverTable.refetch}
          isLoading={serverTable.isFetching}
          showCreate
          onCreate={() => push('/dashboard/products/create')}
          showClear
          showBulkActions={viewMode === 'list'}
          onDelete={handleBulkDelete}
        >
          <ProductsViewToggle />
          <Button type='button' variant='outline' size='sm' onClick={handleExport}>
            <IconDownload className='size-4' />
            Export CSV
          </Button>
          <Button type='button' variant='outline' size='sm' onClick={() => setImportOpen(true)}>
            <IconFileSpreadsheet className='size-4' />
            Import Excel
          </Button>
        </Table.Toolbar>

        {viewMode === 'list' ? (
          <Table.Grid<DtoProductWithLike>
            onRowDoubleClick={(row) => push(`/dashboard/products/edit/${row.original.id}`)}
            isLoading={showInitialLoading}
          />
        ) : showInitialLoading ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className='aspect-[4/5] w-full rounded-2xl' />
            ))}
          </div>
        ) : (
          <ProductsGridView products={serverTable.rows} />
        )}

        <Table.Pagination showPageSize showTotalRows pageSizeOptions={[10, 15, 20, 50, 100, 250]} />
      </Table.Root>

      <ProductImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
}
