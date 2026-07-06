'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { VendorAiInventoryForecastPanel } from '@/domains/vendor/panel/components/ui/vendor-ai-inventory-forecast-panel';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { VendorStatCard } from '@/domains/vendor/panel/components/ui/vendor-stat-card';
import { getVendorModuleConfig } from '@/domains/vendor/panel/data/vendor-module-registry';
import { useVendorAiInventoryForecastQuery } from '@/domains/vendor/panel/hooks/use-vendor-ai-inventory-forecast';
import { cn } from '@/lib/utils';

const PERIOD_DAYS = 30;

const URGENCY_STYLES: Record<string, string> = {
  critical: 'bg-red-500/15 text-red-700 dark:text-red-400',
  warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  ok: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  no_demand: 'bg-muted text-muted-foreground'
};

export function VendorInventoryDomain() {
  const t = useTranslations('vendor.panel.inventoryForecast');
  const config = getVendorModuleConfig('inventory');
  const { data, isLoading } = useVendorAiInventoryForecastQuery(PERIOD_DAYS);

  const forecast = data?.data;
  const rows = forecast?.forecasts ?? [];

  return (
    <div className='space-y-8'>
      <VendorModuleHeader
        title={config?.title ?? 'Inventory'}
        description={config?.description ?? 'Stock forecasting and replenishment planning.'}
      />

      <VendorAiInventoryForecastPanel days={PERIOD_DAYS} />

      <section className='grid gap-4 sm:grid-cols-3'>
        <VendorStatCard
          label={t('lowStock')}
          value={isLoading ? '—' : String(forecast?.low_stock_count ?? 0)}
        />
        <VendorStatCard
          label={t('criticalSkus')}
          value={isLoading ? '—' : String(forecast?.critical_count ?? 0)}
        />
        <VendorStatCard
          label={t('warningSkus')}
          value={isLoading ? '—' : String(forecast?.warning_count ?? 0)}
        />
      </section>

      <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
        <CardHeader>
          <CardTitle>{t('forecastTable')}</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 && !isLoading ? (
            <p className='text-muted-foreground text-sm'>{t('empty')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('product')}</TableHead>
                  <TableHead className='text-right'>{t('stock')}</TableHead>
                  <TableHead className='text-right'>{t('velocity')}</TableHead>
                  <TableHead className='text-right'>{t('daysLeft')}</TableHead>
                  <TableHead className='text-right'>{t('reorder')}</TableHead>
                  <TableHead>{t('urgency')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.product_id ?? row.name}>
                    <TableCell className='max-w-48 truncate font-medium'>{row.name}</TableCell>
                    <TableCell className='text-right tabular-nums'>{row.stock ?? 0}</TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {(row.daily_velocity ?? 0).toFixed(2)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {row.days_until_stockout != null ? row.days_until_stockout.toFixed(1) : '—'}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {row.suggested_reorder_qty ?? 0}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={cn('rounded-full capitalize', URGENCY_STYLES[row.urgency ?? 'ok'])}
                      >
                        {row.urgency?.replace('_', ' ') ?? 'ok'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
