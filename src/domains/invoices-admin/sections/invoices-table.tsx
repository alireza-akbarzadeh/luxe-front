'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInvoicesQueryState } from '@/domains/invoices-admin/hooks/use-invoices-query';
import {
  getInvoicesFromListResponse,
  getInvoicesTotalFromListResponse
} from '@/domains/invoices-admin/lib/invoice-list';
import type { InvoiceStatusFilter } from '@/domains/invoices-admin/invoices.schema';
import { INVOICE_STATUS_TABS } from '@/domains/invoices-admin/invoices.schema';
import {
  invoiceColumns,
  invoiceRowMenuActions
} from '@/domains/invoices-admin/sections/invoices-columns';
import { useGetAdminInvoices } from '@/services/-admin-invoices';
import type { DtoAdminInvoiceListItem, GetAdminInvoices200 } from '@/services/-admin-invoices.schemas';

export function InvoicesTable() {
  const router = useRouter();
  const { status, setStatus } = useInvoicesQueryState();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      search: filter.trim() || undefined,
      status: status === 'all' ? undefined : status
    }),
    [status]
  );

  const getRows = useCallback(
    (data: GetAdminInvoices200 | undefined) => getInvoicesFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetAdminInvoices200 | undefined) => getInvoicesTotalFromListResponse(data),
    []
  );

  const serverTable = useServerTable({
    columns: invoiceColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetAdminInvoices
  });

  const openInvoice = useCallback(
    (id: number) => {
      router.push(`/dashboard/invoices/${id}`);
    },
    [router]
  );

  if (serverTable.isError) {
    return (
      <div className='rounded-xl border border-dashed p-12 text-center'>
        <p className='text-lg font-semibold'>Invoices unavailable</p>
        <p className='text-muted-foreground mt-1 text-sm'>Check your connection and try again.</p>
        <Button className='mt-4' variant='outline' onClick={() => serverTable.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Table.Root {...serverTable.rootProps}>
      <Tabs
        value={status}
        onValueChange={(value) => void setStatus(value as InvoiceStatusFilter)}
        className='px-1'
      >
        <TabsList className='mb-3 h-auto flex-wrap'>
          {INVOICE_STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Table.Toolbar
        searchPlaceholder='Search invoice #, order #, or customer'
        showSearch
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showClear
        showColumnVisibility
        showSorting={false}
        showExport={false}
        showBulkActions={false}
      />

      <Table.Grid<DtoAdminInvoiceListItem>
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        onRowDoubleClick={(row) => row.original.id && openInvoice(row.original.id)}
        getDetailsUrl={(row) =>
          row.original.id ? `/dashboard/invoices/${row.original.id}` : '/dashboard/invoices'
        }
        extendMenuActions={(row) => invoiceRowMenuActions(row.original, openInvoice)}
      />

      <Table.Pagination
        showPageSize
        showTotalRows
        showJumpToPage
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </Table.Root>
  );
}
