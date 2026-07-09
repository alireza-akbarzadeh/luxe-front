'use client';

import { DashboardErrorState } from '@/domains/dashboard/components/dashboard-error-state';
import { DashboardSkeleton } from '@/domains/dashboard/components/dashboard-skeleton';
import { DashboardOverviewContainer } from '@/domains/dashboard/containers/dashboard-overview';
import { useDashboardExport } from '@/domains/dashboard/hooks/use-dashboard-export';
import { useDashboardOverview } from '@/domains/dashboard/hooks/use-dashboard-overview';
import type { DashboardPeriod } from '@/domains/dashboard/hooks/use-dashboard-period';

export function DashboardDomain() {
  const {
    period,
    setPeriod,
    overview,
    generatedLabel,
    isLoading,
    isFetching,
    error,
    refetch,
    data
  } = useDashboardOverview();

  const exportMutation = useDashboardExport();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || data?.success === false) {
    return <DashboardErrorState message={data?.message} onRetry={() => void refetch()} />;
  }

  return (
    <DashboardOverviewContainer
      period={period}
      overview={overview}
      isFetching={isFetching}
      onPeriodChange={(value) => void setPeriod(value as DashboardPeriod)}
      onRefresh={() => void refetch()}
      onExport={() => exportMutation.mutate({ period, format: 'csv' })}
      isExporting={exportMutation.isPending}
      generatedLabel={generatedLabel}
    />
  );
}
