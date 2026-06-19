'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { DashboardPeriod } from '@/domains/dashboard/hooks/use-dashboard-period';
import { formatSeriesDate } from '@/domains/dashboard/lib/dashboard-utils';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { DtoAdminRevenueDailyRow } from '@/services/-admin-reports-revenue-get.schemas';

interface RevenueDailyTableProps {
  period: DashboardPeriod;
  daily?: DtoAdminRevenueDailyRow[];
}

export function RevenueDailyTable({ period, daily = [] }: RevenueDailyTableProps) {
  const rows = [...daily].reverse();
  const totalRevenue = daily.reduce((sum, row) => sum + (row.revenue ?? 0), 0);
  const totalOrders = daily.reduce((sum, row) => sum + (row.orders ?? 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily breakdown</CardTitle>
        <CardDescription>
          Day-by-day revenue, orders, and average order value · period total{' '}
          {formatCurrency(totalRevenue)} across {totalOrders.toLocaleString()} orders
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className='text-right'>Revenue</TableHead>
              <TableHead className='text-right'>Orders</TableHead>
              <TableHead className='text-right'>Paid</TableHead>
              <TableHead className='text-right'>AOV</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='text-muted-foreground h-24 text-center'>
                  No daily data for this period.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const hasRevenue = (row.revenue ?? 0) > 0;
                return (
                  <TableRow key={row.date}>
                    <TableCell className='font-medium'>
                      {row.date ? formatSeriesDate(row.date, period) : '—'}
                    </TableCell>
                    <TableCell
                      className={cn('text-right tabular-nums', hasRevenue && 'font-medium')}
                    >
                      {formatCurrency(row.revenue ?? 0)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>{row.orders ?? 0}</TableCell>
                    <TableCell className='text-right tabular-nums'>{row.paid_orders ?? 0}</TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {(row.paid_orders ?? 0) > 0
                        ? formatCurrency(row.avg_order_value ?? 0)
                        : '—'}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
