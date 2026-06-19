import type { DtoAdminDashboardKPI } from './-admin-dashboard-overview-get.schemas';

export interface DtoAdminRevenueDailyRow {
  date?: string;
  revenue?: number;
  orders?: number;
  paid_orders?: number;
  avg_order_value?: number;
}

export interface DtoAdminRevenueReportSummary {
  revenue?: DtoAdminDashboardKPI;
  orders?: DtoAdminDashboardKPI;
  avg_order_value?: DtoAdminDashboardKPI;
  avg_daily_revenue?: DtoAdminDashboardKPI;
}

export interface DtoAdminRevenueReportResponse {
  period?: string;
  generated_at?: string;
  summary?: DtoAdminRevenueReportSummary;
  daily?: DtoAdminRevenueDailyRow[];
}

export interface DtoAdminRevenueReportApiResponse {
  success?: boolean;
  message?: string;
  code?: number;
  data?: DtoAdminRevenueReportResponse;
}

export type GetAdminReportsRevenueParams = {
  period?: '7d' | '30d' | '90d';
};
