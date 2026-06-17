import type { ChartConfig } from '@/components/ui/chart';
import { formatCurrency } from '@/lib/format';
import type { DtoAdminDashboardKPI } from '@/services/-admin-dashboard-overview-get.schemas';

import type { DashboardPeriod } from '../hooks/use-dashboard-period';

export const revenueChartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(221 83% 53%)' },
  orders: { label: 'Orders', color: 'hsl(142 71% 45%)' }
} satisfies ChartConfig;

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'hsl(262 83% 58%)',
  paid: 'hsl(142 71% 45%)',
  shipped: 'hsl(221 83% 53%)',
  delivered: 'hsl(160 84% 39%)',
  cancelled: 'hsl(0 84% 60%)',
  refunded: 'hsl(220 9% 46%)',
  delayed: 'hsl(31 90% 55%)'
};

export function formatStatusLabel(status: string): string {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatChangePercent(change?: number): string {
  const value = change ?? 0;
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

export function isPositiveChange(change?: number): boolean {
  return (change ?? 0) >= 0;
}

export function formatKpiValue(
  kind: 'currency' | 'count' | 'average',
  kpi?: DtoAdminDashboardKPI
): string {
  const value = kpi?.value ?? 0;
  if (kind === 'currency' || kind === 'average') {
    return formatCurrency(value);
  }
  return Math.round(value).toLocaleString();
}

export function formatSeriesDate(date: string, period: DashboardPeriod): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', {
    month: period === '7d' ? 'short' : 'short',
    day: 'numeric',
    ...(period === '90d' ? {} : { weekday: period === '7d' ? 'short' : undefined })
  });
}

export function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    pending: 'bg-violet-500/10 text-violet-700 border-violet-500/20',
    paid: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    shipped: 'bg-sky-500/10 text-sky-700 border-sky-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    cancelled: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
    refunded: 'bg-muted text-muted-foreground border-border',
    delayed: 'bg-amber-500/10 text-amber-700 border-amber-500/20'
  };
  return map[status.toLowerCase()] ?? 'bg-muted text-muted-foreground border-border';
}
