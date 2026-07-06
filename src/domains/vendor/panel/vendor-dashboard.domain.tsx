'use client';

import {
  IconAlertTriangle,
  IconHeartHandshake,
  IconMessage,
  IconPackage,
  IconReceipt,
  IconShoppingBag,
  IconStar,
  IconTrendingUp,
  IconUsers,
  IconWallet
} from '@tabler/icons-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { VendorActivityFeed } from '@/domains/vendor/panel/components/ui/vendor-activity-feed';
import { VendorAiDashboardPanel } from '@/domains/vendor/panel/components/ui/vendor-ai-dashboard-panel';
import { VendorDashboardCharts } from '@/domains/vendor/panel/components/ui/vendor-dashboard-charts';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { VendorStatCard } from '@/domains/vendor/panel/components/ui/vendor-stat-card';
import {
  VENDOR_DASHBOARD_STATS,
  VENDOR_RECENT_ORDERS,
  VENDOR_TOP_PRODUCTS
} from '@/domains/vendor/panel/data/vendor-dashboard.data';
import { useVendorStoreOrderStatsQuery } from '@/domains/vendor/panel/hooks/use-vendor-store-orders';
import { useVendorStoreProductStatsQuery } from '@/domains/vendor/panel/hooks/use-vendor-store-products';
import { cn } from '@/lib/utils';

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  processing: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  shipped: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
  delivered: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
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
  const pendingOrders =
    (orderStats?.by_status?.['pending'] ?? 0) + (orderStats?.by_status?.['processing'] ?? 0);
  const productCount = productStats?.total ?? stats.products;
  const lowStockCount = productStats?.low_stock ?? stats.lowStock;

  return (
    <div className='space-y-8'>
      <VendorModuleHeader
        title='Dashboard'
        description='Real-time overview of your store performance, orders, and growth metrics.'
        actions={
          <Button variant='outline' size='sm' className='rounded-xl' asChild>
            <Link href='/vendor/panel/analytics'>View analytics</Link>
          </Button>
        }
      />

      <VendorAiDashboardPanel />

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6'>
        <VendorStatCard
          label="Today's revenue"
          value={formatCurrency(stats.todayRevenue)}
          change={stats.todayRevenueChange}
          icon={IconTrendingUp}
        />
        <VendorStatCard
          label='Monthly revenue'
          value={formatCurrency(stats.monthlyRevenue)}
          change={stats.monthlyRevenueChange}
          icon={IconWallet}
        />
        <VendorStatCard
          label='Orders today'
          value={String(stats.ordersToday)}
          change={stats.ordersTodayChange}
          icon={IconShoppingBag}
        />
        <VendorStatCard
          label='Pending orders'
          value={String(pendingOrders > 0 ? pendingOrders : stats.pendingOrders)}
          icon={IconReceipt}
        />
        <VendorStatCard label='Products' value={String(productCount)} icon={IconPackage} />
        <VendorStatCard
          label='Low stock'
          value={String(lowStockCount)}
          icon={IconAlertTriangle}
        />
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <VendorStatCard
          label='Visitors'
          value={stats.visitors.toLocaleString()}
          change={stats.visitorsChange}
          icon={IconUsers}
        />
        <VendorStatCard
          label='Conversion rate'
          value={`${stats.conversionRate}%`}
          change={stats.conversionChange}
        />
        <VendorStatCard
          label='Average order value'
          value={formatCurrency(stats.averageOrderValue)}
          change={stats.aovChange}
        />
        <VendorStatCard label='Refund requests' value={String(stats.refundRequests)} />
      </div>

      <div className='grid gap-4 lg:grid-cols-3'>
        <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none lg:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-base'>Store health</CardTitle>
            <Badge variant='outline' className='rounded-full'>
              {stats.storeHealth}/100
            </Badge>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Progress value={stats.storeHealth} className='h-2' />
            <div className='grid gap-3 sm:grid-cols-3'>
              <HealthMetric label='Store rating' value={`${stats.storeRating} ★`} />
              <HealthMetric label='Pending payout' value={formatCurrency(stats.pendingPayout)} />
              <HealthMetric label='Unread messages' value={String(stats.unreadMessages)} />
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
          <CardHeader>
            <CardTitle className='text-base'>Quick insights</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <InsightRow icon={IconStar} label='Recent reviews' value={String(stats.recentReviews)} />
            <InsightRow icon={IconUsers} label='New customers' value={String(stats.newCustomers)} />
            <InsightRow icon={IconMessage} label='Messages' value={String(stats.unreadMessages)} />
            <InsightRow icon={IconHeartHandshake} label='Repeat rate' value='42%' />
          </CardContent>
        </Card>
      </div>

      <VendorDashboardCharts />

      <div className='grid gap-4 xl:grid-cols-3'>
        <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none xl:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-base'>Recent orders</CardTitle>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/vendor/panel/orders'>View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VENDOR_RECENT_ORDERS.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className='font-medium'>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Badge
                        variant='secondary'
                        className={cn('rounded-full capitalize', ORDER_STATUS_STYLES[order.status])}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-right text-xs'>
                      {order.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className='space-y-4'>
          <VendorActivityFeed />

          <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
            <CardHeader>
              <CardTitle className='text-base'>Top products</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {VENDOR_TOP_PRODUCTS.map((product, index) => (
                <div key={product.name} className='flex items-center justify-between gap-3 text-sm'>
                  <div className='flex items-center gap-2'>
                    <span className='text-muted-foreground w-4 text-xs'>{index + 1}</span>
                    <span className='font-medium'>{product.name}</span>
                  </div>
                  <span className='text-muted-foreground tabular-nums'>
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HealthMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className='border-border/40 bg-muted/20 rounded-xl border p-3'>
      <p className='text-muted-foreground text-xs'>{label}</p>
      <p className='mt-1 font-semibold'>{value}</p>
    </div>
  );
}

function InsightRow({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className='flex items-center justify-between'>
      <span className='text-muted-foreground flex items-center gap-2'>
        <Icon className='size-4' aria-hidden />
        {label}
      </span>
      <span className='font-medium tabular-nums'>{value}</span>
    </div>
  );
}
