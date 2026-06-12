'use client';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useDeferredValue, useState } from 'react';

import { Table } from '~/src/components/table/data-table';
import { buildCategoryTree } from '~/src/domains/categories/categories.util';
import { categoryColumns } from '~/src/domains/categories/sections/category-columns';
import { useGetCategories } from '~/src/services/-categories-get';
import type { ModelsCategory } from '~/src/services/-checkout-post.schemas';

export function CategoriesDomains() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [globalFilter, setGlobalFilter] = useState('');
  const deferredFilter = useDeferredValue(globalFilter);
  const [rowSelection, setRowSelection] = useState({});
  const { push } = useRouter();

  const { data, isLoading, isFetching, refetch } = useGetCategories({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    search: deferredFilter
  });

  const total = data?.data?.total ?? 0;
  const flatCategories = data?.data?.categories ?? [];
  const treeData = buildCategoryTree(flatCategories);

  const table = useReactTable({
    data: treeData,
    columns: categoryColumns,
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
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.children
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
        showColumnVisibility
        showBulkActions
        globalFilter={globalFilter}
      />
      {isLoading ? (
        <Table.Loading columnsCount={8} rowsCount={20} />
      ) : (
        <Table.Grid<ModelsCategory>
          onRowDoubleClick={(row) => push(`/dashboard/categories/edit/${row.original.id}`)}
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
