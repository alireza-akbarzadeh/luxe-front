import type { DtoAdminDashboardOverviewResponseKpiSparklines } from '@/services/-admin-dashboard-overview-get.schemas';

/** Resolves sparkline values for a KPI card from API data. */
export function resolveKpiSparkline(
  sparklines: DtoAdminDashboardOverviewResponseKpiSparklines | undefined,
  key: string
): number[] {
  const values = sparklines?.[key];
  if (values?.length) return values;
  return [];
}

export type DashboardKpiId =
  | 'revenue'
  | 'orders'
  | 'new_customers'
  | 'avg_order_value'
  | 'conversion';

export interface DashboardKpiDefinition {
  id: DashboardKpiId;
  label: string;
  sparklineKey: string;
  iconClassName: string;
  sparklineColor: string;
  kind: 'currency' | 'count' | 'average' | 'percent';
}

export const DASHBOARD_KPI_DEFINITIONS: DashboardKpiDefinition[] = [
  {
    id: 'revenue',
    label: 'Gross revenue',
    sparklineKey: 'revenue',
    iconClassName: 'bg-emerald-500/10 text-emerald-400',
    sparklineColor: '#10b981',
    kind: 'currency'
  },
  {
    id: 'orders',
    label: 'Orders',
    sparklineKey: 'orders',
    iconClassName: 'bg-blue-500/10 text-blue-400',
    sparklineColor: '#3b82f6',
    kind: 'count'
  },
  {
    id: 'new_customers',
    label: 'New customers',
    sparklineKey: 'new_customers',
    iconClassName: 'bg-violet-500/10 text-violet-400',
    sparklineColor: '#a855f7',
    kind: 'count'
  },
  {
    id: 'avg_order_value',
    label: 'Avg. order value',
    sparklineKey: 'avg_order_value',
    iconClassName: 'bg-amber-500/10 text-amber-400',
    sparklineColor: '#f59e0b',
    kind: 'average'
  },
  {
    id: 'conversion',
    label: 'Conversion',
    sparklineKey: 'orders',
    iconClassName: 'bg-cyan-500/10 text-cyan-400',
    sparklineColor: '#06b6d4',
    kind: 'percent'
  }
];

export const DASHBOARD_QUICK_ACTIONS = [
  {
    label: 'New product',
    description: 'Add item to catalog',
    href: '/dashboard/products/create',
    icon: 'product' as const
  },
  {
    label: 'New collection',
    description: 'Group products by theme',
    href: '/dashboard/collections/create',
    icon: 'collection' as const
  },
  {
    label: 'Create discount',
    description: 'Launch a promotion',
    href: '/dashboard/discounts/create',
    icon: 'discount' as const
  },
  {
    label: 'View orders',
    description: 'Fulfillment queue',
    href: '/dashboard/orders',
    icon: 'order' as const
  }
] as const;
