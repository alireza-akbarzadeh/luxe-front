'use client';

import { useRouter } from 'next/navigation';

import { Table, useTableState } from '@/components/table/data-table';
import { shippingProviderColumns } from '@/domains/shipping-providers/sections/provider-columns';
import { useGetShippingProviders } from '@/services/-shipping-providers-get';
import type { ModelsShippingProviders } from '~/src/services/-checkout-post.schemas';

export function ShippingProvidersDomains() {
  const { push } = useRouter();
  const tableState = useTableState();

  const { data, isLoading, isFetching, refetch } = useGetShippingProviders();
  const shippingProviders = data?.data ?? [];

  return (
    <Table.Root
      data={shippingProviders}
      columns={shippingProviderColumns}
      tableState={tableState}
    >
      <Table.Toolbar
        searchPlaceholder='Search by name or code'
        showRefresh
        onRefresh={refetch}
        isLoading={isFetching}
        showCreate
        onCreate={() => push('/dashboard/products/create')}
        showClear
        showColumnVisibility
        showBulkActions
      />
      <Table.Grid<ModelsShippingProviders>
        onRowDoubleClick={(row) => push(`/dashboard/shipping-providers/${row.original.id}`)}
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
