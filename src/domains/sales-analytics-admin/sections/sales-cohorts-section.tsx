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
import { Typography } from '@/components/ui/typography';
import type { DtoAdminSalesCohortRow } from '@/services/-admin-analytics-sales-get.schemas';

interface SalesCohortsSectionProps {
  cohorts?: DtoAdminSalesCohortRow[];
}

export function SalesCohortsSection({ cohorts = [] }: SalesCohortsSectionProps) {
  return (
    <Card className='border-0 shadow-none'>
      <CardHeader>
        <CardTitle>Customer cohorts</CardTitle>
        <CardDescription>Monthly first-order cohorts with repeat purchase rate</CardDescription>
      </CardHeader>
      <CardContent>
        {cohorts.length === 0 ? (
          <Typography.Muted>No cohort data yet.</Typography.Muted>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cohort</TableHead>
                <TableHead className='text-right'>Customers</TableHead>
                <TableHead className='text-right'>Repeat rate</TableHead>
                <TableHead className='text-right'>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cohorts.map((row) => (
                <TableRow key={row.cohort}>
                  <TableCell className='font-medium'>{row.cohort}</TableCell>
                  <TableCell className='text-right tabular-nums'>{row.customers ?? 0}</TableCell>
                  <TableCell className='text-right tabular-nums'>{row.repeat_rate ?? 0}%</TableCell>
                  <TableCell className='text-right tabular-nums'>
                    ${(row.revenue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
