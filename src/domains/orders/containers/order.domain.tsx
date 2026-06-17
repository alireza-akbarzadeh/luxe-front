'use client';

import { IconChartBar, IconPlus, IconRotateClockwise2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { OrdersKPICards } from '@/domains/orders/sections/0rders-kpi-cards';
import OrdersTable from '@/domains/orders/sections/orders-table';
import {
  getGetAdminDashboardOverviewQueryKey,
  useGetAdminDashboardOverview
} from '@/services/-admin-dashboard-overview-get';
import { getGetOrdersQueryKey } from '@/services/-orders-get';

export function OrdersDomain() {
  const queryClient = useQueryClient();
  const { data: overviewResponse, isLoading: isOverviewLoading } = useGetAdminDashboardOverview({
    period: '30d'
  });

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() });
    void queryClient.invalidateQueries({
      queryKey: getGetAdminDashboardOverviewQueryKey({ period: '30d' })
    });
  };

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-400 px-6 py-5'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl'>
                  <IconChartBar className='text-primary h-4.5 w-4.5' />
                </div>
                <div>
                  <h1 className='text-xl font-black tracking-tight'>Orders</h1>
                  <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                    Management Console
                  </p>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='h-9 gap-2 rounded-xl text-[10px] font-bold uppercase'
                onClick={handleRefresh}
              >
                <IconRotateClockwise2 className='h-3.5 w-3.5' /> Refresh
              </Button>
              <Button size='sm' className='h-9 gap-2 rounded-xl text-[10px] font-bold uppercase' disabled>
                <IconPlus className='h-3.5 w-3.5' /> New Order
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-400 space-y-8 px-6 py-8'>
        <OrdersKPICards overview={overviewResponse?.data} isLoading={isOverviewLoading} />
        <div>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <h2 className='text-base font-black tracking-tight'>All Orders</h2>
              <p className='text-muted-foreground mt-0.5 text-[11px]'>
                Double-click any row to open order details
              </p>
            </div>
          </div>
          <OrdersTable />
        </div>
      </div>
    </div>
  );
}
