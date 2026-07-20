'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTransactionsQueryState } from '@/domains/transactions-admin/hooks/use-transactions-query';
import {
  getPaymentsFromListResponse,
  getPaymentsTotalFromListResponse
} from '@/domains/transactions-admin/lib/payment-list';
import {
  paymentColumns,
  paymentRowMenuActions
} from '@/domains/transactions-admin/sections/payments-columns';
import type { PaymentStatusFilter } from '@/domains/transactions-admin/transactions.schema';
import { PAYMENT_STATUS_TABS } from '@/domains/transactions-admin/transactions.schema';
import { useGetAdminPayments } from '@/services/-admin-payments-get';
import type {
  DtoAdminPaymentListItem,
  GetAdminPayments200
} from '@/services/-admin-payments-get.schemas';

export function PaymentsTable() {
  const router = useRouter();
  const { paymentStatus, setPaymentStatus } = useTransactionsQueryState();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      page: state.pagination.pageIndex + 1,
      limit: state.pagination.pageSize,
      search: filter.trim() || undefined,
      status: paymentStatus === 'all' ? undefined : paymentStatus
    }),
    [paymentStatus]
  );

  const getRows = useCallback(
    (data: GetAdminPayments200 | undefined) => getPaymentsFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetAdminPayments200 | undefined) => getPaymentsTotalFromListResponse(data),
    []
  );

  const serverTable = useServerTable({
    columns: paymentColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetAdminPayments
  });

  const openPayment = useCallback(
    (id: number) => {
      router.push(`/dashboard/transactions/payments/${id}`);
    },
    [router]
  );

  if (serverTable.isError) {
    return (
      <div className='rounded-xl border border-dashed p-12 text-center'>
        <p className='text-lg font-semibold'>Payments unavailable</p>
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
        value={paymentStatus}
        onValueChange={(value) => void setPaymentStatus(value as PaymentStatusFilter)}
        className='px-1'
      >
        <TabsList className='mb-3 h-auto flex-wrap'>
          {PAYMENT_STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Table.Toolbar
        searchPlaceholder='Search transaction ID, Stripe session, or order #'
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

      <Table.Grid<DtoAdminPaymentListItem>
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        onRowDoubleClick={(row) => row.original.id && openPayment(row.original.id)}
        getDetailsUrl={(row) =>
          row.original.id
            ? `/dashboard/transactions/payments/${row.original.id}`
            : '/dashboard/transactions'
        }
        extendMenuActions={(row) => paymentRowMenuActions(row.original, openPayment)}
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
