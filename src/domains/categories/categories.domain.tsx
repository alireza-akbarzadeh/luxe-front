'use client';
import { useRouter } from 'next/navigation';
import { useDeferredValue } from 'react';

import { Table, useTableState } from '~/src/components/table/data-table';
import { buildCategoryTree } from '~/src/domains/categories/categories.util';
import { categoryColumns } from '~/src/domains/categories/sections/category-columns';
import { useGetCategories } from '~/src/services/-categories-get';
import type { ModelsCategory } from '~/src/services/-checkout-post.schemas';

export function CategoriesDomains() {
  const { push } = useRouter();
  const tableState = useTableState();
  const deferredFilter = useDeferredValue(tableState.globalFilter);

  const { data, isLoading, isFetching, refetch } = useGetCategories({
    search: deferredFilter
  });

  const flatCategories = data?.data?.categories ?? [];
  const treeData = buildCategoryTree(flatCategories);

  return (
    <Table.Root
      data={treeData}
      columns={categoryColumns}
      globalFilter={tableState.globalFilter}
      onGlobalFilterChange={tableState.setGlobalFilter}
      sorting={tableState.sorting}
      onSortingChange={tableState.setSorting}
      columnFilters={tableState.columnFilters}
      onColumnFiltersChange={tableState.setColumnFilters}
      expanded={tableState.expanded}
      onExpandedChange={tableState.setExpanded}
      getSubRows={(row: ModelsCategory) => {
        return row.children;
      }}
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
        onRowDoubleClick={(row) => push(`/dashboard/categories/edit/${row.original.id}`)}
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
