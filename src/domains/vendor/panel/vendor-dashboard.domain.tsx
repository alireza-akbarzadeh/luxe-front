'use client';

import {
  IconAdjustmentsDollar,
  IconChevronRight,
  IconCreditCard,
  IconDownload,
  IconShoppingBag,
  IconTrendingUp,
  IconUsers
} from '@tabler/icons-react';
import Link from 'next/link';

import { DashboardKpiCard } from '@/components/dashboard/dashboard-kpi-card';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { VendorDashboardCharts } from '@/domains/vendor/panel/components/ui/vendor-dashboard-charts';
import {
  VENDOR_DASHBOARD_STATS,
  VENDOR_INSIGHTS,
  VENDOR_RECENT_ORDERS,
  VENDOR_SALES_CHANNELS,
  VENDOR_TOP_PRODUCTS
} from '@/domains/vendor/panel/data/vendor-dashboard.data';
import { useVendorStoreOrderStatsQuery } from '@/domains/vendor/panel/hooks/use-vendor-store-orders';
import { useVendorStoreProductStatsQuery } from '@/domains/vendor/panel/hooks/use-vendor-store-products';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';

const KPI_SPARKLINES = {
  revenue: [12, 14, 13, 16, 18, 17, 20],
  profit: [8, 9, 10, 11, 13, 14, 16],
  orders: [18, 20, 19, 22, 24, 23, 26],
  visitors: [22, 24, 23, 26, 28, 27, 30],
  conversion: [2.8, 3.1, 3.0, 3.4, 3.6, 3.5, 3.87]
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function VendorDashboardDomain() {
  const stats = VENDOR_DASHBOARD_STATS;
  const { data: productStatsData } = useVendorStoreProductStatsQuery();
  const { data: orderStatsData } = useVendorStoreOrderStatsQuery();

  const productStats = productStatsData?.data;
  const orderStats = orderStatsData?.data;
  const productCount = productStats?.total ?? stats.products;
  const orderCount = orderStats?.total ?? stats.orders;

  return (
    <div className='space-y-6'>
      <DashboardPageHeader
        title='Dashboard'
        description="Welcome back! Here's what's happening with your store."
        actions={
          <Button variant='outline' size='sm' className='rounded-xl border-white/10 bg-transparent'>
            <IconDownload className='mr-2 size-4' />
            Export report
          </Button>
        }
      />

      <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
        <DashboardKpiCard
          label='Total revenue'
          value={formatCurrency(stats.totalRevenue)}
          change={stats.totalRevenueChange}
          icon={IconAdjustmentsDollar}
          iconClassName='bg-emerald-500/10 text-emerald-400'
          sparkline={KPI_SPARKLINES.revenue}
          sparklineColor='#10b981'
        />
        <DashboardKpiCard
          label='Net profit'
          value={formatCurrency(stats.netProfit)}
          change={stats.netProfitChange}
          icon={IconTrendingUp}
          iconClassName='bg-emerald-500/10 text-emerald-400'
          sparkline={KPI_SPARKLINES.profit}
          sparklineColor='#10b981'
        />
        <DashboardKpiCard
          label='Orders'
          value={orderCount.toLocaleString()}
          change={stats.ordersChange}
          icon={IconShoppingBag}
          iconClassName='bg-blue-500/10 text-blue-400'
          sparkline={KPI_SPARKLINES.orders}
          sparklineColor='#3b82f6'
        />
        <DashboardKpiCard
          label='Visitors'
          value={stats.visitors.toLocaleString()}
          change={stats.visitorsChange}
          icon={IconUsers}
          iconClassName='bg-violet-500/10 text-violet-400'
          sparkline={KPI_SPARKLINES.visitors}
          sparklineColor='#a855f7'
        />
        <DashboardKpiCard
          label='Conversion rate'
          value={`${stats.conversionRate}%`}
          change={stats.conversionChange}
          icon={IconCreditCard}
          iconClassName='bg-amber-500/10 text-amber-400'
          sparkline={KPI_SPARKLINES.conversion}
          sparklineColor='#f59e0b'
        />
      </section>

      <VendorDashboardCharts />

      <section className='grid gap-4 xl:grid-cols-3'>
        <div className='dashboard-card xl:col-span-2'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <h2 className='text-base font-semibold'>Recent orders</h2>
              <p className='text-muted-foreground text-sm'>Latest transactions from your store</p>
            </div>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/vendor/panel/orders'>View all</Link>
            </Button>
          </div>
          <div className='space-y-3'>
            {VENDOR_RECENT_ORDERS.map((order) => (
              <div
                key={order.id}
                className='flex items-center justify-between gap-3 rounded-lg border border-white/6 bg-white/2 px-3 py-2.5'
              >
                <div className='flex min-w-0 items-center gap-3'>
                  <AppImage
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(order.customer)}`}
                    alt={order.customer}
                    width={36}
                    height={36}
                    className='size-9 rounded-full object-cover'
                    unoptimized
                  />
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium'>{order.customer}</p>
                    <p className='text-muted-foreground text-xs'>{order.id}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-semibold tabular-nums'>{formatCurrency(order.total)}</p>
                  <p className='text-muted-foreground text-xs'>{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='dashboard-card'>
          <h2 className='text-base font-semibold'>Top products</h2>
          <p className='text-muted-foreground mb-4 text-sm'>Best performers this month</p>
          <div className='space-y-3'>
            {VENDOR_TOP_PRODUCTS.map((product) => (
              <div key={product.name} className='flex items-center gap-3'>
                <AppImage
                  src={IMAGE_FALLBACK}
                  alt={product.name}
                  width={40}
                  height={40}
                  className='size-10 rounded-lg object-cover'
                />
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>{product.name}</p>
                  <p className='text-muted-foreground text-xs'>{product.units} sold</p>
                </div>
                <p className='text-sm font-semibold tabular-nums'>{formatCurrency(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='grid gap-4 md:grid-cols-3'>
        <DashboardKpiCard
          label='Customer satisfaction'
          value={`${stats.storeRating}/5`}
          change={4.2}
          sparkline={[4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.8]}
          sparklineColor='#10b981'
          className='md:col-span-1'
        />
        <DashboardKpiCard
          label='Repeat customer rate'
          value={`${stats.repeatCustomerRate}%`}
          change={6.4}
          sparkline={[34, 36, 37, 39, 40, 41, 42.6]}
          sparklineColor='#a855f7'
          className='md:col-span-1'
        />
        <div className='dashboard-card md:col-span-1'>
          <div className='mb-3 flex items-center justify-between'>
            <p className='text-muted-foreground text-xs font-medium'>Store health</p>
            <span className='text-sm font-semibold tabular-nums'>{stats.storeHealth}/100</span>
          </div>
          <Progress value={stats.storeHealth} className='h-2' />
          <p className='text-muted-foreground mt-3 text-xs'>
            Excellent! Your store is performing great.
          </p>
          <p className='text-muted-foreground mt-1 text-xs'>
            {productCount.toLocaleString()} products · {stats.lowStock} low stock alerts
          </p>
        </div>
      </section>

      <section className='dashboard-card'>
        <h2 className='mb-4 text-base font-semibold'>Insights</h2>
        <div className='grid gap-3 md:grid-cols-2'>
          {VENDOR_INSIGHTS.map((insight) => (
            <button
              key={insight.id}
              type='button'
              className='flex items-start gap-3 rounded-lg border border-white/6 bg-white/2 p-3 text-left transition-colors hover:bg-white/4'
            >
              <span
                className={cn(
                  'mt-0.5 size-2 shrink-0 rounded-full',
                  insight.tone === 'emerald' && 'bg-emerald-400',
                  insight.tone === 'blue' && 'bg-blue-400',
                  insight.tone === 'amber' && 'bg-amber-400',
                  insight.tone === 'violet' && 'bg-violet-400'
                )}
              />
              <span className='min-w-0 flex-1'>
                <span className='block text-sm font-medium'>{insight.title}</span>
                <span className='text-muted-foreground mt-0.5 block text-xs'>{insight.description}</span>
              </span>
              <IconChevronRight className='text-muted-foreground mt-0.5 size-4 shrink-0' />
            </button>
          ))}
        </div>
      </section>

      <section className='dashboard-card'>
        <h2 className='mb-4 text-base font-semibold'>Top sales channels</h2>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
          {VENDOR_SALES_CHANNELS.map((channel) => (
            <div
              key={channel.channel}
              className='rounded-lg border border-white/6 bg-white/2 p-3'
            >
              <div className='mb-2 flex items-center gap-2'>
                <span className='size-2 rounded-full' style={{ background: channel.color }} />
                <span className='text-sm font-medium'>{channel.channel}</span>
              </div>
              <p className='text-lg font-semibold tabular-nums'>{channel.percent}%</p>
              <p className='text-muted-foreground text-xs tabular-nums'>
                {formatCurrency(channel.revenue)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
