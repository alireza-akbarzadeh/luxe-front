'use client';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useDeferredValue, useState } from 'react';

import { Table } from '~/src/components/table/data-table';
import { productColumns } from '~/src/domains/product-dashboard/sections/product-columns';
import { useGetProducts } from '~/src/services/-products-get';
import type { DtoProductWithLike } from '~/src/services/-products-get.schemas';

export function ProductsDomains() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const deferredFilter = useDeferredValue(globalFilter);
  const { push } = useRouter();

  const { data, isLoading, isFetching, refetch } = useGetProducts({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    name: deferredFilter || undefined
  });

  const products = data?.data?.products ?? [];
  const total = data?.data?.total ?? 0;

  const table = useReactTable({
    data: products,
    columns: productColumns,
    state: {
      pagination,
      globalFilter
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: (value) => {
      setGlobalFilter(value);
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    },
    pageCount: Math.ceil(total / pagination.pageSize),
    manualPagination: true,
    manualFiltering: true,
    rowCount: total,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <Table.Root table={table}>
      <Table.Toolbar
        searchPlaceholder='Search by name or SKU'
        showRefresh
        onRefresh={refetch}
        isLoading={isFetching}
        showCreate
        onCreate={() => push('/dashboard/products/create')}
        showClear
        onClearFilter={() => setGlobalFilter('')}
        globalFilter={globalFilter}
      />

      {isLoading ? (
        <Table.Loading columnsCount={8} rowsCount={20} />
      ) : (
        <Table.Grid<DtoProductWithLike>
          onRowDoubleClick={(row) => push(`/dashboard/products/edit/${row.original.id}`)}
          columnsCount={8}
        />
      )}

      <Table.Pagination />
    </Table.Root>
  );
}
