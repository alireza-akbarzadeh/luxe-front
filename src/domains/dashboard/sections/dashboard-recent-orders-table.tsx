import { formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import type { DtoAdminDashboardRecentOrder } from '@/services/-admin-dashboard-overview-get.schemas';

import { formatStatusLabel, statusBadgeClass } from '../lib/dashboard-utils';

interface DashboardRecentOrdersTableProps {
  recentOrders?: DtoAdminDashboardRecentOrder[];
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

export function DashboardRecentOrdersTable({ recentOrders = [] }: DashboardRecentOrdersTableProps) {
  return (
    <Card className='dashboard-card border-0 shadow-none'>
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
  );
}
