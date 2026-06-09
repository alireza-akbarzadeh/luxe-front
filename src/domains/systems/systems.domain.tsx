'use client';

import { IconPlus, IconRefresh } from '@tabler/icons-react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable
} from '@tanstack/react-table';
import { useState } from 'react';

import { Table } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { systemColumns } from '@/domains/systems/sections/system-columns';
import { SystemsSetSetting } from '@/domains/systems/sections/system-set-settong';
import { SystemSettingDelete } from '@/domains/systems/sections/system-setting-delete';
import { useSettingsDialogStore } from '@/domains/systems/system.store';
import { useGetSettings } from '~/src/services/-settings-get';
import type { DtoSettingResponse } from '~/src/services/-settings-get.schemas';

export function SystemsDomain() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: settings, isLoading, refetch } = useGetSettings();
  const openCreate = useSettingsDialogStore((store) => store.openCreate);
  const openUpdate = useSettingsDialogStore((store) => store.openUpdate);

  const table = useReactTable({
    data: settings?.data || [],
    columns: systemColumns,
    state: {
      globalFilter,
      sorting
    },
    enableRowSelection: true,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, _, filterValue) => {
      const search = String(filterValue).toLowerCase();
      return (
        row?.original?.key?.toLowerCase().includes(search) ||
        row.original.description?.toLowerCase().includes(search) ||
        false
      );
    }
  });

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>System Settings</h1>
      </div>

      <Table.Root table={table}>
        <div className='bg-muted/5 border-border/40 flex flex-wrap items-center gap-3 border-b px-6 py-4'>
          <div className='flex min-w-50 flex-1 items-center gap-2'>
            <Table.Search placeholder='Search by key or description…' />
            {globalFilter && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setGlobalFilter('')}
                className='text-muted-foreground h-8 px-2'
              >
                Clear
              </Button>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='icon' disabled={isLoading} onClick={() => refetch()}>
              <IconRefresh className='h-4 w-4' />
            </Button>
            <Button onClick={openCreate} variant='outline' size='icon'>
              <IconPlus className='h-4 w-4' />
            </Button>
            <div className='text-muted-foreground text-xs font-medium'>
              {table.getFilteredRowModel().rows.length} settings
            </div>
          </div>
        </div>

        <div className='h-125 overflow-auto border border-gray-200 p-2'>
          {isLoading ? (
            <Table.Loading columnsCount={systemColumns.length} rowsCount={10} />
          ) : (
            <Table.Body<DtoSettingResponse>
              columnsCount={systemColumns.length}
              onRowDoubleClick={(row) => {
                openUpdate(row.original);
              }}
            />
          )}
        </div>

        <div className='border-border/40 border-t px-6 py-4'>
          <Table.Pagination />
        </div>
      </Table.Root>

      <SystemsSetSetting onSuccess={refetch} />
      <SystemSettingDelete onSuccess={refetch} />
    </div>
  );
}
