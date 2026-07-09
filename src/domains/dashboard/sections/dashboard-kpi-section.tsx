import {
  IconAdjustmentsDollar,
  IconCreditCard,
  IconPercentage,
  IconShoppingCart,
  IconUsers
} from '@tabler/icons-react';

import { DashboardKpiCard } from '@/components/dashboard/dashboard-kpi-card';
import type { DtoAdminDashboardKPIs } from '@/services/-admin-dashboard-overview-get.schemas';
import type { DtoAdminDashboardOverviewResponseKpiSparklines } from '@/services/-admin-dashboard-overview-get.schemas';
import type { DtoAdminDashboardKPI } from '@/services/-admin-dashboard-overview-get.schemas';

import {
  DASHBOARD_KPI_DEFINITIONS,
  type DashboardKpiId,
  resolveKpiSparkline
} from '../lib/dashboard-mappers';
import { formatKpiValue } from '../lib/dashboard-utils';

const KPI_ICONS = {
  revenue: IconAdjustmentsDollar,
  orders: IconShoppingCart,
  new_customers: IconUsers,
  avg_order_value: IconCreditCard,
  conversion: IconPercentage
} as const;

interface DashboardKpiSectionProps {
  kpis?: DtoAdminDashboardKPIs;
  conversion?: DtoAdminDashboardKPI;
  sparklines?: DtoAdminDashboardOverviewResponseKpiSparklines;
}

function resolveKpiValue(
  id: DashboardKpiId,
  kpis?: DtoAdminDashboardKPIs,
  conversion?: DtoAdminDashboardKPI
): DtoAdminDashboardKPI | undefined {
  if (id === 'conversion') return conversion;
  return kpis?.[id];
}

export function DashboardKpiSection({ kpis, conversion, sparklines }: DashboardKpiSectionProps) {
  return (
    <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
      {DASHBOARD_KPI_DEFINITIONS.map((item) => {
        const kpi = resolveKpiValue(item.id, kpis, conversion);
        const Icon = KPI_ICONS[item.id];
        return (
          <DashboardKpiCard
            key={item.id}
            label={item.label}
            value={formatKpiValue(item.kind, kpi)}
            change={kpi?.change_percent}
            icon={Icon}
            iconClassName={item.iconClassName}
            sparkline={resolveKpiSparkline(sparklines, item.sparklineKey)}
            sparklineColor={item.sparklineColor}
          />
        );
      })}
    </section>
  );
}
