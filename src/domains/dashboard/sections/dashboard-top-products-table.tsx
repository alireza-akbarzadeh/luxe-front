import { IconPackage } from '@tabler/icons-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/format';
import type { DtoAdminDashboardTopProduct } from '@/services/-admin-dashboard-overview-get.schemas';

interface DashboardTopProductsTableProps {
  topProducts?: DtoAdminDashboardTopProduct[];
}

export function DashboardTopProductsTable({ topProducts = [] }: DashboardTopProductsTableProps) {
  return (
    <Card className='dashboard-card border-0 shadow-none lg:col-span-2'>
      <CardHeader>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <CardTitle>Top selling products</CardTitle>
            <CardDescription>Best performers in the selected period</CardDescription>
          </div>
          <Badge variant='outline' className='gap-1'>
            <IconPackage className='h-3 w-3' />
            Live inventory
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {topProducts.length === 0 ? (
          <div className='text-muted-foreground py-10 text-center text-sm'>
            No product sales recorded for this period.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className='text-right'>Sold</TableHead>
                <TableHead className='text-right'>Revenue</TableHead>
                <TableHead className='text-right'>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product) => (
                <TableRow key={product.id ?? product.sku}>
                  <TableCell>
                    <Link
                      href={
                        product.id
                          ? `/dashboard/products/edit/${product.id}`
                          : '/dashboard/products'
                      }
                      className='hover:underline'
                    >
                      <div className='font-medium'>{product.name}</div>
                      <div className='text-muted-foreground text-xs'>{product.sku}</div>
                    </Link>
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {(product.units_sold ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {formatCurrency(product.revenue ?? 0)}
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>
                    <span
                      className={
                        (product.stock ?? 0) < 10 ? 'font-medium text-amber-600' : undefined
                      }
                    >
                      {product.stock ?? 0}
                    </span>
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
