'use client';

import { Table, useTableState } from '@/components/table/data-table';
import { systemColumns } from '@/domains/systems/sections/system-columns';
import { useGetSettings } from '@/services/-settings-get';
import type { DtoSettingResponse } from '@/services/-settings-get.schemas';

export function SystemsDomain() {
  const tableState = useTableState({ initialPageSize: 20 });

  const { data, isLoading, isFetching, refetch } = useGetSettings();
  const settings = data?.data ?? [];

  return (
    <Table.Root data={settings} columns={systemColumns} tableState={tableState}>
      <Table.Toolbar
        searchPlaceholder='Search by key or description'
        showRefresh
        onRefresh={refetch}
        isLoading={isFetching}
        showClear
        showColumnVisibility
      />
      <Table.Grid<DtoSettingResponse> isLoading={isLoading} />
      <Table.Pagination showPageSize showTotalRows pageSizeOptions={[10, 20, 50, 100]} />
    </Table.Root>
  );
}
