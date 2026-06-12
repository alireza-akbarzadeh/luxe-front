'use client';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useDeferredValue, useState } from 'react';

import { Table } from '~/src/components/table/data-table';
import { brandColumns } from '~/src/domains/brands/sections/brand-columns';
import { useGetBrands } from '~/src/services/-brands-get';
import type { ModelsCategory } from '~/src/services/-checkout-post.schemas';

export function BrandsDomains() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [globalFilter, setGlobalFilter] = useState('');
  const deferredFilter = useDeferredValue(globalFilter);
  const [rowSelection, setRowSelection] = useState({});
  const { push } = useRouter();

  const { data, isLoading, isFetching, refetch } = useGetBrands({
    limit: pagination.pageSize,
    page: pagination.pageIndex * pagination.pageSize,
    search: deferredFilter
  });

  const total = data?.data?.length ?? 0;
  const brands = data?.data ?? [];

  const table = useReactTable({
    data: brands,
    columns: brandColumns,
    getRowId: (row) => String(row.id),
    state: {
      pagination,
      globalFilter,
      rowSelection
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: (value) => {
      setGlobalFilter(value);
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    pageCount: Math.ceil(total / pagination.pageSize),
    manualPagination: true,
    manualFiltering: true,
    rowCount: total,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <Table.Root table={table}>
      <Table.Toolbar
        searchPlaceholder='Search by name'
        showRefresh
        onRefresh={refetch}
        isLoading={isFetching}
        showCreate
        onCreate={() => push('/dashboard/products/create')}
        showClear
        onClearFilter={() => setGlobalFilter('')}
        showColumnVisibility
        showBulkActions
        globalFilter={globalFilter}
      />
      {isLoading ? (
        <Table.Loading columnsCount={8} rowsCount={20} />
      ) : (
        <Table.Grid<ModelsCategory>
          onRowDoubleClick={(row) => push(`/dashboard/brands/edit/${row.original.id}`)}
          columnsCount={8}
        />
      )}
      <Table.Pagination
        showPageSize
        showTotalRows
        showJumpToPage
        pageSizeOptions={[10, 20, 50, 100, 200]}
      />
    </Table.Root>
  );
}
