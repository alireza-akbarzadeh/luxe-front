'use client';

import { IconPackage, IconReceipt, IconShoppingBag, IconTrendingUp } from '@tabler/icons-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { VendorAiSalesInsightsPanel } from '@/domains/vendor/panel/components/ui/vendor-ai-sales-insights-panel';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { VendorSalesRevenueChart } from '@/domains/vendor/panel/components/ui/vendor-sales-revenue-chart';
import { VendorStatCard } from '@/domains/vendor/panel/components/ui/vendor-stat-card';
import { getVendorModuleConfig } from '@/domains/vendor/panel/data/vendor-module-registry';
import { useVendorAiSalesInsightsQuery } from '@/domains/vendor/panel/hooks/use-vendor-ai-sales-insights';

const PERIOD_DAYS = 30;

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function VendorAnalyticsDomain() {
  const config = getVendorModuleConfig('analytics');
  const { data, isLoading } = useVendorAiSalesInsightsQuery(PERIOD_DAYS);

  const insights = data?.data;
  const metrics = insights?.metrics;
  const dailySeries = insights?.daily_series ?? [];
  const topProducts = insights?.top_products ?? [];

  return (
    <div className='space-y-8'>
      <VendorModuleHeader
        title={config?.title ?? 'Analytics'}
        description={config?.description ?? 'Revenue and sales performance for your store.'}
      />

      <VendorAiSalesInsightsPanel days={PERIOD_DAYS} />

      <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <VendorStatCard
          label='Revenue'
          value={isLoading ? '—' : formatCurrency(metrics?.revenue ?? 0)}
          change={metrics?.revenue_change_pct}
          icon={IconTrendingUp}
        />
        <VendorStatCard
          label='Orders'
          value={isLoading ? '—' : String(metrics?.order_count ?? 0)}
          change={metrics?.orders_change_pct}
          icon={IconReceipt}
        />
        <VendorStatCard
          label='Units sold'
          value={isLoading ? '—' : String(metrics?.units_sold ?? 0)}
          icon={IconPackage}
        />
        <VendorStatCard
          label='Avg. order value'
          value={isLoading ? '—' : formatCurrency(metrics?.avg_order_value ?? 0)}
          icon={IconShoppingBag}
        />
      </section>

      <section className='grid gap-4 xl:grid-cols-3'>
        <div className='xl:col-span-2'>
          <VendorSalesRevenueChart series={dailySeries} periodDays={insights?.period_days ?? PERIOD_DAYS} />
        </div>

        <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
          <CardHeader>
            <CardTitle>Top products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className='text-muted-foreground text-sm'>No product sales in this period.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className='text-right'>Revenue</TableHead>
                    <TableHead className='text-right'>Units</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.product_id ?? product.name}>
                      <TableCell className='max-w-40 truncate font-medium'>{product.name}</TableCell>
                      <TableCell className='text-right tabular-nums'>
                        {formatCurrency(product.revenue ?? 0)}
                      </TableCell>
                      <TableCell className='text-right tabular-nums'>{product.units ?? 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
