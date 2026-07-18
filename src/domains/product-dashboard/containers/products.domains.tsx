'use client';

import { IconDownload, IconFileSpreadsheet, IconFilter } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductImportDialog } from '@/domains/product-dashboard/components/product-import-dialog';
import { ProductsGridView } from '@/domains/product-dashboard/components/products-grid-view';
import { ProductsViewToggle } from '@/domains/product-dashboard/components/products-view-toggle';
import { useProductsExport } from '@/domains/product-dashboard/hooks/use-products-export';
import { useProductsQueryState } from '@/domains/product-dashboard/hooks/use-products-query';
import { useProductsViewMode } from '@/domains/product-dashboard/hooks/use-products-view-mode';
import { buildProductExportParams } from '@/domains/product-dashboard/lib/product-export-params';
import { productColumns } from '@/domains/product-dashboard/sections/product-columns';
import { ProductsFilterSheet } from '@/domains/product-dashboard/sections/products-filter-sheet';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { useDeleteProductsBulk } from '@/services/-products-bulk-delete';
import { getGetProductsQueryKey, useGetProducts } from '@/services/-products-get';
import type { DtoProductWithLike, GetProducts200 } from '@/services/-products-get.schemas';

export function ProductsDomains() {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const [importOpen, setImportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode] = useProductsViewMode();
  const { isDesktop } = useMediaDevices();
  const {
    status,
    minPrice,
    maxPrice,
    categoryId,
    brandId,
    isDigital,
    hasActiveFilters,
    resetFilters
  } = useProductsQueryState();
  const exportMutation = useProductsExport();

  const effectiveViewMode = isDesktop ? viewMode : 'grid';

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      name: filter || undefined,
      status: status === 'all' ? undefined : status,
      min_price: minPrice ?? undefined,
      max_price: maxPrice ?? undefined,
      category_id: categoryId ?? undefined,
      brand_id: brandId ?? undefined,
      is_digital: isDigital === 'all' ? undefined : isDigital === 'yes'
    }),
    [status, minPrice, maxPrice, categoryId, brandId, isDigital]
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

  // Filters live in the URL — jump back to page 1 when they change.
  useEffect(() => {
    serverTable.tableState.resetPagination();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when filter query params change
  }, [status, minPrice, maxPrice, categoryId, brandId, isDigital]);

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
    const search = serverTable.tableState.globalFilter?.trim();
    exportMutation.mutate(
      buildProductExportParams({
        status,
        minPrice,
        maxPrice,
        categoryId,
        brandId,
        isDigital,
        search
      })
    );
  }, [
    exportMutation,
    status,
    minPrice,
    maxPrice,
    categoryId,
    brandId,
    isDigital,
    serverTable.tableState.globalFilter
  ]);

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
          showBulkActions={effectiveViewMode === 'list'}
          onDelete={handleBulkDelete}
        >
          {isDesktop ? <ProductsViewToggle /> : null}
          <Button type='button' variant='outline' size='sm' onClick={() => setFilterOpen(true)}>
            <IconFilter className='size-4' />
            Filters
            {hasActiveFilters ? (
              <span className='bg-primary text-primary-foreground ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold'>
                ON
              </span>
            ) : null}
          </Button>
          {isDesktop ? (
            <>
              <Button
                type='button'
                variant='outline'
                size='sm'
                disabled={exportMutation.isPending}
                onClick={handleExport}
              >
                <IconDownload className='size-4' />
                Export CSV
              </Button>
              <Button type='button' variant='outline' size='sm' onClick={() => setImportOpen(true)}>
                <IconFileSpreadsheet className='size-4' />
                Import Excel
              </Button>
            </>
          ) : null}
        </Table.Toolbar>

        {effectiveViewMode === 'list' ? (
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
      <ProductsFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onReset={() => void resetFilters()}
      />
    </>
  );
}
