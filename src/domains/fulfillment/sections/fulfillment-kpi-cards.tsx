'use client';

import { useQueries } from '@tanstack/react-query';

import {
  FULFILLMENT_ORDER_WORKFLOW_STATES,
  FULFILLMENT_QUEUE_TABS
} from '@/domains/fulfillment/schemas/fulfillment.schema';
import { SHIPMENT_IN_TRANSIT_STATUSES } from '@/domains/shipments-admin/shipments.schema';
import { getAdminShipments } from '@/services/-admin-shipments-get';
import type { GetAdminShipments200 } from '@/services/-admin-shipments-get.schemas';
import { getOrders } from '@/services/-orders-get';
import type { GetOrders200 } from '@/services/-orders-get.schemas';

function readOrderTotal(data: GetOrders200 | undefined) {
  return data?.data?.total ?? 0;
}

function readShipmentTotal(data: GetAdminShipments200 | undefined) {
  return data?.data?.total ?? 0;
}

function KPICard({
  title,
  value,
  subtitle,
  accent
}: {
  title: string;
  value: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className='bg-card relative overflow-hidden rounded-2xl border p-5 shadow-sm'>
      <div className={`absolute -top-4 -right-4 h-20 w-20 rounded-full opacity-10 ${accent}`} />
      <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
        {title}
      </p>
      <p className='text-foreground mt-2 text-3xl font-black tracking-tight tabular-nums'>
        {value}
      </p>
      <p className='text-muted-foreground mt-1 text-[10px]'>{subtitle}</p>
    </div>
  );
}

export function FulfillmentKPICards() {
  const orderQueueKeys = FULFILLMENT_QUEUE_TABS.filter((tab) => tab.value !== 'tracking').map(
    (tab) => tab.value as keyof typeof FULFILLMENT_ORDER_WORKFLOW_STATES
  );

  const statusQueries = useQueries({
    queries: [
      ...orderQueueKeys.map((queueKey) => ({
        queryKey: ['fulfillment-kpi', 'orders', queueKey],
        queryFn: () =>
          getOrders({
            limit: 1,
            offset: 0,
            workflow_state: FULFILLMENT_ORDER_WORKFLOW_STATES[queueKey]
          })
      })),
      ...SHIPMENT_IN_TRANSIT_STATUSES.map((status) => ({
        queryKey: ['fulfillment-kpi', 'shipments', status],
        queryFn: () => getAdminShipments({ status, limit: 1, offset: 0 })
      }))
    ]
  });

  const pickTotal = readOrderTotal(statusQueries[0]?.data);
  const packTotal = readOrderTotal(statusQueries[1]?.data);
  const shipTotal = readOrderTotal(statusQueries[2]?.data);
  const trackingTotal = SHIPMENT_IN_TRANSIT_STATUSES.reduce((sum, _status, index) => {
    return sum + readShipmentTotal(statusQueries[index + 3]?.data);
  }, 0);

  const loading = statusQueries.some((query) => query.isLoading);
  const dash = loading ? '—' : undefined;

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <KPICard
        title='Pick queue'
        value={dash ?? pickTotal.toLocaleString()}
        subtitle='Paid — ready to pick'
        accent='bg-sky-500'
      />
      <KPICard
        title='Pack queue'
        value={dash ?? packTotal.toLocaleString()}
        subtitle='Processing — ready to pack'
        accent='bg-amber-500'
      />
      <KPICard
        title='Ship queue'
        value={dash ?? shipTotal.toLocaleString()}
        subtitle='Packed — ready to ship'
        accent='bg-violet-500'
      />
      <KPICard
        title='In transit'
        value={dash ?? trackingTotal.toLocaleString()}
        subtitle='Shipments on the way'
        accent='bg-emerald-500'
      />
    </div>
  );
}
