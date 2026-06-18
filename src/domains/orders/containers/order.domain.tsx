'use client';

import { Flex } from '@/components/ui/flex';
import { OrdersKPICards } from '@/domains/orders/sections/0rders-kpi-cards';
import { OrdersTable } from '@/domains/orders/sections/orders-table';
import { useGetAdminDashboardOverview } from '@/services/-admin-dashboard-overview-get';

export function OrdersDomain() {
  const { data: overviewResponse, isLoading: isOverviewLoading } = useGetAdminDashboardOverview({
    period: '30d'
  });

  return (
    <Flex direction='column' className='gap-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Orders</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Track fulfillment, payment status, and customer orders across your store.
        </p>
      </div>

      <OrdersKPICards overview={overviewResponse?.data} isLoading={isOverviewLoading} />

      <OrdersTable />
    </Flex>
  );
}
