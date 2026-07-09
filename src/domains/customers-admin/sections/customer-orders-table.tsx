'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import {
  getOrdersFromListResponse,
  getOrdersTotalFromListResponse
} from '@/domains/orders/lib/order-list';
import { orderColumns } from '@/domains/orders/sections/orders-columns';
import { useGetOrders } from '@/services/-orders-get';
import type { DtoAdminOrderListItem, GetOrders200 } from '@/services/-orders-get.schemas';

interface CustomerOrdersTableProps {
  userId: number;
}

export function CustomerOrdersTable({ userId }: CustomerOrdersTableProps) {
  const router = useRouter();

  const getQueryParams = useCallback(
    (state: TableState) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      user_id: userId
    }),
    [userId]
  );

  const getRows = useCallback(
    (data: GetOrders200 | undefined) => getOrdersFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetOrders200 | undefined) => getOrdersTotalFromListResponse(data),
    []
  );

  const serverTable = useServerTable({
    columns: orderColumns,
    initialPageSize: 10,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetOrders
  });

  const openOrder = useCallback(
    (id: number) => {
      router.push(`/dashboard/orders/${id}`);
    },
    [router]
  );

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <Flex
        direction='row'
        align='center'
        justify='between'
        className='bg-muted/20 border-border/10 border-b px-6 py-4'
      >
        <Text variant='overline' className='text-muted-foreground'>
          Purchase history
        </Text>
      </Flex>

      <div className='p-2'>
        <Table.Root {...serverTable.rootProps}>
          <Table.Grid<DtoAdminOrderListItem>
            isLoading={serverTable.isLoading && serverTable.rows.length === 0}
            onRowDoubleClick={(row) => row.original.id && openOrder(row.original.id)}
            getDetailsUrl={(row) =>
              row.original.id ? `/dashboard/orders/${row.original.id}` : '/dashboard/orders'
            }
          />
          <Table.Pagination showPageSize={false} showTotalRows showJumpToPage={false} />
        </Table.Root>
      </div>
    </div>
  );
}
