'use client';

import { IconDownload, IconRefresh } from '@tabler/icons-react';

import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { Button } from '@/components/ui/button';
import {
  dashboardPeriodLabel,
  dashboardPeriods
} from '@/domains/dashboard/hooks/use-dashboard-period';
import { DashboardActivitySection } from '@/domains/dashboard/sections/dashboard-activity-section';
import { DashboardChartsSection } from '@/domains/dashboard/sections/dashboard-charts-section';
import { DashboardHealthSection } from '@/domains/dashboard/sections/dashboard-health-section';
import { DashboardInsightsSection } from '@/domains/dashboard/sections/dashboard-insights-section';
import { DashboardKpiSection } from '@/domains/dashboard/sections/dashboard-kpi-section';
import { DashboardLowStockTable } from '@/domains/dashboard/sections/dashboard-low-stock-table';
import { DashboardNotificationsSection } from '@/domains/dashboard/sections/dashboard-notifications-section';
import { DashboardPlatformSection } from '@/domains/dashboard/sections/dashboard-platform-section';
import { DashboardQuickActionsSection } from '@/domains/dashboard/sections/dashboard-quick-actions-section';
import { DashboardRecentOrdersTable } from '@/domains/dashboard/sections/dashboard-recent-orders-table';
import { DashboardTopProductsTable } from '@/domains/dashboard/sections/dashboard-top-products-table';
import type { DashboardOverviewContainerProps } from '@/domains/dashboard/types/dashboard.types';

export function DashboardOverviewContainer({
  period,
  overview,
  isFetching,
  onPeriodChange,
  onRefresh,
  onExport,
  isExporting,
  generatedLabel
}: DashboardOverviewContainerProps) {
  return (
    <div className='space-y-6'>
      <DashboardPageHeader
        title='Dashboard'
        description='Monitor revenue, orders, inventory, and customer growth across your platform.'
        actions={
          <div className='flex flex-wrap items-center gap-2'>
            <div className='flex items-center gap-1 rounded-xl border border-white/8 p-1'>
              {dashboardPeriods.map((option) => (
                <Button
                  key={option}
                  size='sm'
                  variant={period === option ? 'secondary' : 'ghost'}
                  className='h-8 rounded-lg px-3 text-xs'
                  onClick={() => onPeriodChange(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <Button
              variant='outline'
              size='sm'
              className='rounded-xl border-white/10 bg-transparent'
              onClick={onExport}
              disabled={isExporting}
            >
              <IconDownload className='mr-2 size-4' />
              Export report
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-9 w-9 rounded-xl'
              onClick={onRefresh}
              disabled={isFetching}
              aria-label='Refresh dashboard'
            >
              <IconRefresh className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        }
      />

      <p className='text-muted-foreground -mt-2 text-xs'>
        Updated {generatedLabel} · {dashboardPeriodLabel(period)}
      </p>

      <DashboardKpiSection
        kpis={overview?.kpis}
        conversion={overview?.conversion}
        sparklines={overview?.kpi_sparklines}
      />

      <DashboardChartsSection
        period={period}
        revenueSeries={overview?.revenue_series}
        ordersByStatus={overview?.orders_by_status}
      />

      <div className='grid gap-4 xl:grid-cols-2'>
        <DashboardHealthSection health={overview?.platform_health} />
        <DashboardQuickActionsSection />
      </div>

      <div className='grid gap-4 xl:grid-cols-2'>
        <DashboardNotificationsSection />
        <DashboardInsightsSection insights={overview?.ai_insights} />
      </div>

      <DashboardPlatformSection platform={overview?.platform} />

      <DashboardActivitySection activity={overview?.recent_activity} />

      <section className='grid gap-4 lg:grid-cols-3'>
        <DashboardTopProductsTable topProducts={overview?.top_products} />
        <DashboardLowStockTable lowStockProducts={overview?.low_stock_products} />
      </section>

      <DashboardRecentOrdersTable recentOrders={overview?.recent_orders} />
    </div>
  );
}
