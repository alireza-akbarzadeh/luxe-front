import type { DtoAdminDashboardOverviewResponse } from '@/services/-admin-dashboard-overview-get.schemas';

import type { DashboardPeriod } from '../hooks/use-dashboard-period';

export type DashboardOverviewData = DtoAdminDashboardOverviewResponse;

export interface DashboardOverviewContainerProps {
  period: DashboardPeriod;
  overview?: DashboardOverviewData;
  isFetching: boolean;
  onPeriodChange: (period: DashboardPeriod) => void;
  onRefresh: () => void;
  onExport: () => void;
  isExporting: boolean;
  generatedLabel: string;
}
