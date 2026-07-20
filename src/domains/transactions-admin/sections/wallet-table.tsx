'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTransactionsQueryState } from '@/domains/transactions-admin/hooks/use-transactions-query';
import {
  getWalletTxFromListResponse,
  getWalletTxTotalFromListResponse
} from '@/domains/transactions-admin/lib/wallet-list';
import {
  walletColumns,
  walletRowMenuActions
} from '@/domains/transactions-admin/sections/wallet-columns';
import type { WalletTypeFilter } from '@/domains/transactions-admin/transactions.schema';
import { WALLET_TYPE_TABS } from '@/domains/transactions-admin/transactions.schema';
import { useGetAdminWalletTransactions } from '@/services/-admin-wallet-transactions-get';
import type {
  DtoAdminWalletTxListItem,
  GetAdminWalletTransactions200
} from '@/services/-admin-wallet-transactions-get.schemas';

export function WalletTransactionsTable() {
  const router = useRouter();
  const { walletType, setWalletType } = useTransactionsQueryState();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      page: state.pagination.pageIndex + 1,
      limit: state.pagination.pageSize,
      search: filter.trim() || undefined,
      type: walletType === 'all' ? undefined : walletType
    }),
    [walletType]
  );

  const getRows = useCallback(
    (data: GetAdminWalletTransactions200 | undefined) => getWalletTxFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetAdminWalletTransactions200 | undefined) => getWalletTxTotalFromListResponse(data),
    []
  );

  const serverTable = useServerTable({
    columns: walletColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetAdminWalletTransactions
  });

  const openTransaction = useCallback(
    (id: number) => {
      router.push(`/dashboard/transactions/wallet/${id}`);
    },
    [router]
  );

  if (serverTable.isError) {
    return (
      <div className='rounded-xl border border-dashed p-12 text-center'>
        <p className='text-lg font-semibold'>Wallet ledger unavailable</p>
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
        value={walletType}
        onValueChange={(value) => void setWalletType(value as WalletTypeFilter)}
        className='px-1'
      >
        <TabsList className='mb-3 h-auto flex-wrap'>
          {WALLET_TYPE_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Table.Toolbar
        searchPlaceholder='Search description, Stripe session, or customer'
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

      <Table.Grid<DtoAdminWalletTxListItem>
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        onRowDoubleClick={(row) => row.original.id && openTransaction(row.original.id)}
        getDetailsUrl={(row) =>
          row.original.id
            ? `/dashboard/transactions/wallet/${row.original.id}`
            : '/dashboard/transactions'
        }
        extendMenuActions={(row) => walletRowMenuActions(row.original, openTransaction)}
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
