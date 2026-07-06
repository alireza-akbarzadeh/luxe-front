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
import { VendorAiCustomerSegmentsPanel } from '@/domains/vendor/panel/components/ui/vendor-ai-customer-segments-panel';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { VendorStatCard } from '@/domains/vendor/panel/components/ui/vendor-stat-card';
import { getVendorModuleConfig } from '@/domains/vendor/panel/data/vendor-module-registry';
import { useVendorAiCustomerSegmentsQuery } from '@/domains/vendor/panel/hooks/use-vendor-ai-customer-segments';
import { cn } from '@/lib/utils';

const PERIOD_DAYS = 365;

const SEGMENT_STYLES: Record<string, string> = {
  vip: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  loyal: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  repeat: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
  new: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
  at_risk: 'bg-red-500/15 text-red-700 dark:text-red-400',
  one_time: 'bg-muted text-muted-foreground'
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function VendorCustomersDomain() {
  const t = useTranslations('vendor.panel.customerSegments');
  const config = getVendorModuleConfig('customers');
  const { data, isLoading } = useVendorAiCustomerSegmentsQuery(PERIOD_DAYS);

  const analysis = data?.data;
  const segmentSummaries = analysis?.segments ?? [];
  const customers = analysis?.customers ?? [];

  const vipCount = segmentSummaries.find((s) => s.segment === 'vip')?.count ?? 0;
  const atRiskCount = segmentSummaries.find((s) => s.segment === 'at_risk')?.count ?? 0;
  const repeatCount =
    (segmentSummaries.find((s) => s.segment === 'loyal')?.count ?? 0) +
    (segmentSummaries.find((s) => s.segment === 'repeat')?.count ?? 0);

  return (
    <div className='space-y-8'>
      <VendorModuleHeader
        title={config?.title ?? 'Customers'}
        description={config?.description ?? 'Understand buyer segments and retention opportunities.'}
      />

      <VendorAiCustomerSegmentsPanel days={PERIOD_DAYS} />

      <section className='grid gap-4 sm:grid-cols-3'>
        <VendorStatCard label={t('vipCustomers')} value={isLoading ? '—' : String(vipCount)} />
        <VendorStatCard label={t('repeatBuyers')} value={isLoading ? '—' : String(repeatCount)} />
        <VendorStatCard label={t('atRisk')} value={isLoading ? '—' : String(atRiskCount)} />
      </section>

      <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
        <CardHeader>
          <CardTitle>{t('segmentsTable')}</CardTitle>
        </CardHeader>
        <CardContent>
          {segmentSummaries.length === 0 && !isLoading ? (
            <p className='text-muted-foreground text-sm'>{t('empty')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('segment')}</TableHead>
                  <TableHead className='text-right'>{t('customers')}</TableHead>
                  <TableHead className='text-right'>{t('totalSpend')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {segmentSummaries.map((row) => (
                  <TableRow key={row.segment}>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={cn('rounded-full', SEGMENT_STYLES[row.segment ?? 'one_time'])}
                      >
                        {row.label}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>{row.count ?? 0}</TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {formatCurrency(row.total_spend ?? 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
        <CardHeader>
          <CardTitle>{t('customersTable')}</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 && !isLoading ? (
            <p className='text-muted-foreground text-sm'>{t('empty')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('customer')}</TableHead>
                  <TableHead>{t('segment')}</TableHead>
                  <TableHead className='text-right'>{t('orders')}</TableHead>
                  <TableHead className='text-right'>{t('totalSpend')}</TableHead>
                  <TableHead className='text-right'>{t('avgOrder')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((row) => (
                  <TableRow key={row.user_id}>
                    <TableCell>
                      <div className='font-medium'>{row.name || row.email}</div>
                      {row.name ? (
                        <div className='text-muted-foreground text-xs'>{row.email}</div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={cn('rounded-full capitalize', SEGMENT_STYLES[row.segment ?? 'one_time'])}
                      >
                        {row.segment?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>{row.order_count ?? 0}</TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {formatCurrency(row.total_spend ?? 0)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {formatCurrency(row.avg_order_value ?? 0)}
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
