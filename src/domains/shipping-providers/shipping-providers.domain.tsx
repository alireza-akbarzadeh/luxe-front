'use client';
import { useRouter } from 'next/navigation';

import { Table, useTableState } from '@/components/table/data-table';
import { shippingProviderColumns } from '@/domains/shipping-providers/sections/provider-columns';
import type { ModelsCategory } from '@/services/-checkout-post.schemas';
import { useGetShippingProviders } from '@/services/-shipping-providers-get';

export function ShippingProvidersDomains() {
  const { push } = useRouter();
  const tableState = useTableState();

  const { data, isLoading, isFetching, refetch } = useGetShippingProviders();

  const shippingProviders = data?.data ?? [];

  return (
    <Table.Root
      data={shippingProviders}
      columns={shippingProviderColumns}
      globalFilter={tableState.globalFilter}
      onGlobalFilterChange={tableState.setGlobalFilter}
      sorting={tableState.sorting}
      onSortingChange={tableState.setSorting}
      columnFilters={tableState.columnFilters}
      onColumnFiltersChange={tableState.setColumnFilters}
      expanded={tableState.expanded}
    >
      <Table.Toolbar
        searchPlaceholder='Search by name or SKU'
        showRefresh
        onRefresh={refetch}
        isLoading={isFetching}
        showCreate
        onCreate={() => push('/dashboard/products/create')}
        showClear
        onClearFilter={() => tableState.setGlobalFilter('')}
        showColumnVisibility
        showBulkActions
        globalFilter={tableState.globalFilter}
      />
      <Table.Grid<ModelsCategory>
        onRowDoubleClick={(row) => push(`/dashboard/shipments/edit/${row.original.id}`)}
        columnsCount={8}
        isLoading={isLoading}
      />
      <Table.Pagination
        showPageSize
        showTotalRows
        showJumpToPage
        pageSizeOptions={[10, 20, 50, 100, 200]}
      />
    </Table.Root>
  );
}
