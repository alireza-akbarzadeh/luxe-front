'use client';

import { IconAlertTriangle, IconChevronDown, IconFilter } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AUDIT_ACTION_OPTIONS,
  AuditActionBadge
} from '@/domains/audit/components/audit-action-badge';
import { auditColumns } from '@/domains/audit/components/audit-columns';
import { AuditDetailSheet } from '@/domains/audit/components/audit-detail-sheet';
import type { DtoAuditLogResponse, GetAdminAuditLogs200 } from '@/domains/audit/lib/audit-types';
import { useGetAdminAuditLogs } from '@/services/-admin-audit-logs-get';
import type { GetAdminAuditLogsParams } from '@/services/-admin-audit-logs-get.schemas';

export function AuditLogTable() {
  const [selectedLog, setSelectedLog] = useState<DtoAuditLogResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => {
      const actionFilter = state.columnFilters.find((f) => f.id === 'action')?.value as
        | string
        | undefined;

      const params: GetAdminAuditLogsParams = {
        limit: state.pagination.pageSize,
        offset: state.pagination.pageIndex * state.pagination.pageSize,
        search: filter.trim() || undefined,
        action: actionFilter,
        date_from: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        date_to: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined
      };

      return params;
    },
    [dateRange]
  );

  const getRows = useCallback(
    (data: GetAdminAuditLogs200 | undefined) => data?.data?.logs ?? [],
    []
  );

  const getTotal = useCallback(
    (data: GetAdminAuditLogs200 | undefined) => data?.data?.total ?? 0,
    []
  );

  const serverTable = useServerTable({
    columns: auditColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    enableRowSelection: false,
    useQuery: (params) => useGetAdminAuditLogs(params)
  });

  const openDetail = (log: DtoAuditLogResponse) => {
    setSelectedLog(log);
    setDetailOpen(true);
  };

  const applyActionFilter = (action: string | null) => {
    if (!action) {
      serverTable.tableState.setColumnFilters([]);
      return;
    }
    serverTable.tableState.setColumnFilters([{ id: 'action', value: action }]);
  };

  const activeAction = serverTable.tableState.columnFilters.find((f) => f.id === 'action')
    ?.value as string | undefined;

  const actionOptions = useMemo(
    () => AUDIT_ACTION_OPTIONS.map((action) => ({ action, label: action })),
    []
  );

  if (serverTable.isError && serverTable.error) {
    const message =
      typeof serverTable.error === 'object' &&
      serverTable.error !== null &&
      'message' in serverTable.error
        ? String((serverTable.error as { message?: string }).message)
        : 'Failed to load audit logs';

    return (
      <div className='rounded-4xl border-2 border-dashed p-16 text-center'>
        <IconAlertTriangle className='text-destructive mx-auto mb-4 h-12 w-12' />
        <h3 className='text-lg font-bold tracking-tight uppercase italic'>Sync Error</h3>
        <p className='text-muted-foreground text-sm font-medium'>{message}</p>
      </div>
    );
  }

  const { tableState, isLoading, isFetching, refetch, total } = serverTable;

  return (
    <>
      <Table.Root {...serverTable.rootProps}>
        <Table.Toolbar
          searchPlaceholder='Search path, resource, actor email...'
          showRefresh
          onRefresh={refetch}
          isLoading={isFetching}
          showClear
          onClearFilter={() => {
            setDateRange(undefined);
            tableState.resetFilters();
          }}
          showColumnVisibility
          showSorting
          showExport
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='border-border/60 hover:bg-background h-10 gap-2 rounded-xl border-dashed text-[10px] font-bold uppercase'
              >
                <IconFilter className='text-primary h-3.5 w-3.5' />
                Action: {activeAction ?? 'All'}
                <IconChevronDown className='h-3 w-3 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='border-border/40 w-48 rounded-xl p-1 shadow-2xl'
            >
              <DropdownMenuItem
                onClick={() => applyActionFilter(null)}
                className='py-2 text-[10px] font-bold uppercase'
              >
                All actions
              </DropdownMenuItem>
              {actionOptions.map(({ action, label }) => (
                <DropdownMenuItem
                  key={action}
                  onClick={() => applyActionFilter(action)}
                  className='py-2 text-[10px] font-bold uppercase'
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
            className='border-border/60 hover:bg-background h-10 w-auto min-w-52 rounded-xl border-dashed text-[10px] font-bold uppercase'
          />
        </Table.Toolbar>

        <div className='border-border/40 bg-background/50 flex flex-wrap items-center justify-between border-b px-6 py-4'>
          <div className='flex flex-wrap gap-2'>
            {actionOptions.map(({ action }) => {
              const isActive = activeAction === action;
              return (
                <Button
                  key={action}
                  variant={isActive ? 'default' : 'outline'}
                  size='sm'
                  className='gap-2 rounded-full px-3'
                  onClick={() => applyActionFilter(isActive ? null : action)}
                >
                  <AuditActionBadge action={action} className='border-0 bg-transparent p-0' />
                </Button>
              );
            })}
          </div>
          <div className='text-primary bg-primary/10 border-primary/20 rounded-full border px-4 py-1.5 text-[10px] leading-none font-black tracking-widest uppercase'>
            {total.toLocaleString()} Events
          </div>
        </div>

        <Table.Grid<DtoAuditLogResponse>
          onRowDoubleClick={(row) => openDetail(row.original)}
          isLoading={isLoading}
        />

        <Table.Pagination
          showPageSize
          showTotalRows
          showJumpToPage
          pageSizeOptions={[10, 20, 50, 100]}
        />
      </Table.Root>

      <AuditDetailSheet log={selectedLog} open={detailOpen} onOpenChange={setDetailOpen} />
    </>
  );
}
