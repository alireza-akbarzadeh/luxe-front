'use client';

import { useQueries } from '@tanstack/react-query';

import { SHIPMENT_IN_TRANSIT_STATUSES } from '@/domains/shipments-admin/shipments.schema';
import { getAdminShipments } from '@/services/-admin-shipments';
import type { GetAdminShipments200 } from '@/services/-admin-shipments.schemas';

function readTotal(data: GetAdminShipments200 | undefined) {
  return data?.data?.total ?? 0;
}

interface ShipmentsKPICardsProps {
  isLoading?: boolean;
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
      <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>{title}</p>
      <p className='text-foreground mt-2 text-3xl font-black tracking-tight tabular-nums'>{value}</p>
      <p className='text-muted-foreground mt-1 text-[10px]'>{subtitle}</p>
    </div>
  );
}

export function ShipmentsKPICards({ isLoading }: ShipmentsKPICardsProps) {
  const statusQueries = useQueries({
    queries: [
      { queryKey: ['shipments-kpi', 'all'], queryFn: () => getAdminShipments({ limit: 1, offset: 0 }) },
      { queryKey: ['shipments-kpi', 'pending'], queryFn: () => getAdminShipments({ status: 'pending', limit: 1, offset: 0 }) },
      ...SHIPMENT_IN_TRANSIT_STATUSES.map((status) => ({
        queryKey: ['shipments-kpi', status],
        queryFn: () => getAdminShipments({ status, limit: 1, offset: 0 })
      })),
      { queryKey: ['shipments-kpi', 'delivered'], queryFn: () => getAdminShipments({ status: 'delivered', limit: 1, offset: 0 }) }
    ]
  });

  const allTotal = readTotal(statusQueries[0]?.data);
  const pendingTotal = readTotal(statusQueries[1]?.data);
  const inTransitTotal = SHIPMENT_IN_TRANSIT_STATUSES.reduce((sum, _status, index) => {
    return sum + readTotal(statusQueries[index + 2]?.data);
  }, 0);
  const deliveredTotal = readTotal(statusQueries[4]?.data);

  const loading = isLoading || statusQueries.some((query) => query.isLoading);
  const dash = loading ? '—' : undefined;

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <KPICard
        title='All shipments'
        value={dash ?? allTotal.toLocaleString()}
        subtitle='Total shipment records'
        accent='bg-blue-500'
      />
      <KPICard
        title='Awaiting pickup'
        value={dash ?? pendingTotal.toLocaleString()}
        subtitle='Pending fulfillment'
        accent='bg-amber-500'
      />
      <KPICard
        title='In transit'
        value={dash ?? inTransitTotal.toLocaleString()}
        subtitle='Processing or shipped'
        accent='bg-violet-500'
      />
      <KPICard
        title='Delivered'
        value={dash ?? deliveredTotal.toLocaleString()}
        subtitle='Successfully delivered'
        accent='bg-emerald-500'
      />
    </div>
  );
}
