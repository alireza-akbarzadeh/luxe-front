'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';

export const dashboardPeriods = ['7d', '30d', '90d'] as const;
export type DashboardPeriod = (typeof dashboardPeriods)[number];

/** Syncs admin dashboard period filter to the URL search param. */
export function useDashboardPeriod() {
  return useQueryState(
    'period',
    parseAsStringLiteral(dashboardPeriods).withDefault('30d')
  );
}

export function dashboardPeriodLabel(period: DashboardPeriod): string {
  switch (period) {
    case '7d':
      return 'Last 7 days';
    case '90d':
      return 'Last 90 days';
    default:
      return 'Last 30 days';
  }
}
