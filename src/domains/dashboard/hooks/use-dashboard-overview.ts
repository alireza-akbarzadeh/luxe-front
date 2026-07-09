'use client';

import { formatDistanceToNow, parseISO } from 'date-fns';

import { useGetAdminDashboardOverview } from '@/services/-admin-dashboard-overview-get';
import type { GetAdminDashboardOverview200 } from '@/services/-admin-dashboard-overview-get.schemas';

import { useDashboardPeriod } from './use-dashboard-period';

/** Fetches and normalizes admin dashboard overview data for the home page. */
export function useDashboardOverview() {
  const [period, setPeriod] = useDashboardPeriod();
  const query = useGetAdminDashboardOverview({ period }, { query: { staleTime: 60_000 } });

  const overview = (query.data as GetAdminDashboardOverview200 | undefined)?.data;
  const generatedLabel = overview?.generated_at
    ? formatDistanceToNow(parseISO(overview.generated_at), { addSuffix: true })
    : 'just now';

  return {
    period,
    setPeriod,
    overview,
    generatedLabel,
    ...query
  };
}
