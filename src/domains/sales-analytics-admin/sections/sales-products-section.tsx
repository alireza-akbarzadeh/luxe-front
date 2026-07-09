'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';
import type {
  DtoAdminDashboardTopProduct,
  DtoAdminSalesSegmentCount
} from '@/services/-admin-analytics-sales-get.schemas';

interface SalesProductsSectionProps {
  topProducts?: DtoAdminDashboardTopProduct[];
  segments?: DtoAdminSalesSegmentCount[];
}

export function SalesProductsSection({
  topProducts = [],
  segments = []
}: SalesProductsSectionProps) {
  return (
    <section className='grid gap-4 lg:grid-cols-2'>
      <Card className='border-0 shadow-none'>
        <CardHeader>
          <CardTitle>Top products</CardTitle>
          <CardDescription>Best sellers by revenue in the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <Typography.Muted>No product sales in this period.</Typography.Muted>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className='text-right'>Units</TableHead>
                  <TableHead className='text-right'>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Flex direction='column' className='gap-0.5'>
                        <span className='font-medium'>{product.name}</span>
                        <span className='text-muted-foreground text-xs'>{product.sku}</span>
                      </Flex>
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {product.units_sold ?? 0}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      $
                      {(product.revenue ?? 0).toLocaleString(undefined, {
                        maximumFractionDigits: 0
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className='border-0 shadow-none'>
        <CardHeader>
          <CardTitle>Customer segments</CardTitle>
          <CardDescription>CRM segment distribution across all customers</CardDescription>
        </CardHeader>
        <CardContent>
          {segments.length === 0 ? (
            <Typography.Muted>No segment data.</Typography.Muted>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Segment</TableHead>
                  <TableHead className='text-right'>Customers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {segments.map((segment) => (
                  <TableRow key={segment.segment}>
                    <TableCell className='font-medium capitalize'>{segment.segment}</TableCell>
                    <TableCell className='text-right tabular-nums'>{segment.count ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
