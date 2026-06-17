import { IconAlertTriangle, IconPackage } from '@tabler/icons-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { cn } from '@/lib/utils';
import type {
  DtoAdminDashboardLowStockProduct,
  DtoAdminDashboardRecentOrder,
  DtoAdminDashboardTopProduct
} from '@/services/-admin-dashboard-overview-get.schemas';

import { formatStatusLabel, statusBadgeClass } from '../lib/dashboard-utils';

interface DashboardTablesProps {
  recentOrders?: DtoAdminDashboardRecentOrder[];
  topProducts?: DtoAdminDashboardTopProduct[];
  lowStockProducts?: DtoAdminDashboardLowStockProduct[];
}

function customerInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatOrderTime(value?: string): string {
  if (!value) return '—';
  const parsed = parseISO(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return formatDistanceToNow(parsed, { addSuffix: true });
}

function StatusBadge({ status }: { status?: string }) {
  const label = formatStatusLabel(status ?? '');
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
        statusBadgeClass(status ?? '')
      )}
    >
      {label}
    </span>
  );
}

export function DashboardTables({
  recentOrders = [],
  topProducts = [],
  lowStockProducts = []
}: DashboardTablesProps) {
  return (
    <>
      <section className='grid gap-4 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
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

        <Card>
          <CardHeader>
            <div className='flex items-center justify-between gap-2'>
              <div>
                <CardTitle>Low stock alerts</CardTitle>
                <CardDescription>Products at or below threshold</CardDescription>
              </div>
              <IconAlertTriangle className='text-amber-500 h-4 w-4' />
            </div>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <div className='text-muted-foreground py-10 text-center text-sm'>
                Inventory levels look healthy.
              </div>
            ) : (
              <div className='space-y-3'>
                {lowStockProducts.map((product) => (
                  <Link
                    key={product.id ?? product.sku}
                    href={
                      product.id
                        ? `/dashboard/products/edit/${product.id}`
                        : '/dashboard/inventory'
                    }
                    className='hover:bg-muted/60 block rounded-xl border p-3 transition-colors'
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0'>
                        <p className='truncate font-medium'>{product.name}</p>
                        <p className='text-muted-foreground text-xs'>{product.sku}</p>
                      </div>
                      <div className='text-right'>
                        <p className='text-amber-600 text-sm font-semibold tabular-nums'>
                          {product.stock ?? 0} left
                        </p>
                        <p className='text-muted-foreground text-[10px]'>
                          threshold {product.threshold ?? 0}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link
                  href='/dashboard/inventory'
                  className='text-primary block pt-1 text-xs font-semibold hover:underline'
                >
                  View inventory
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between gap-4'>
              <div>
                <CardTitle>Recent orders</CardTitle>
                <CardDescription>Latest checkout activity across the store</CardDescription>
              </div>
              <Link
                href='/dashboard/orders'
                className='text-xs font-semibold transition-colors hover:underline'
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className='text-muted-foreground py-10 text-center text-sm'>
                No orders yet. Sales will appear here as they come in.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className='text-right'>Total</TableHead>
                    <TableHead className='text-right'>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id ?? order.order_number}>
                      <TableCell>
                        <Link
                          href={order.id ? `/dashboard/orders/${order.id}` : '/dashboard/orders'}
                          className='hover:underline'
                        >
                          <div className='font-mono text-xs'>{order.order_number}</div>
                          <div className='text-muted-foreground text-[10px]'>
                            {formatOrderTime(order.created_at)}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-8 w-8'>
                            <AvatarFallback className='text-xs'>
                              {customerInitials(order.customer_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-medium'>{order.customer_name || 'Guest'}</div>
                            <div className='text-muted-foreground text-xs'>
                              {order.customer_email || '—'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='text-right tabular-nums'>
                        {formatCurrency(order.total_amount ?? 0, order.currency ?? 'USD')}
                      </TableCell>
                      <TableCell className='text-right'>
                        <StatusBadge status={order.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
