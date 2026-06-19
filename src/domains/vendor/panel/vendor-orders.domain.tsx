'use client';

import {
  IconDownload,
  IconFilter,
  IconPrinter,
  IconSearch
} from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { VENDOR_MOCK_ORDERS } from '@/domains/vendor/panel/data/vendor-dashboard.data';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  processing: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  shipped: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
  delivered: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  refund_requested: 'bg-red-500/15 text-red-700 dark:text-red-400'
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function VendorOrdersDomain() {
  return (
    <div className='space-y-6'>
      <VendorModuleHeader
        title='Orders'
        description='Manage fulfillment, shipping labels, refunds, and order timelines.'
        badge={`${VENDOR_MOCK_ORDERS.length} orders`}
        actions={
          <>
            <Button variant='outline' size='sm' className='gap-1 rounded-xl'>
              <IconDownload className='size-4' />
              Export CSV
            </Button>
            <Button size='sm' className='gap-1 rounded-xl'>
              <IconPrinter className='size-4' />
              Bulk print
            </Button>
          </>
        }
      />

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
        <div className='relative max-w-md flex-1'>
          <IconSearch className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input placeholder='Search orders, customers, tracking…' className='rounded-xl pl-9' />
        </div>
        <Button variant='outline' size='sm' className='gap-1 rounded-xl'>
          <IconFilter className='size-4' />
          Filters
        </Button>
      </div>

      <div className='border-border/40 bg-card/50 overflow-hidden rounded-2xl border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {VENDOR_MOCK_ORDERS.map((order) => (
              <TableRow key={order.id} className='cursor-pointer'>
                <TableCell className='font-medium'>{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p>{order.customer}</p>
                    <p className='text-muted-foreground text-xs'>{order.email}</p>
                  </div>
                </TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell className='capitalize'>{order.payment}</TableCell>
                <TableCell>
                  <Badge
                    variant='secondary'
                    className={cn('rounded-full capitalize', STATUS_STYLES[order.status])}
                  >
                    {order.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{order.channel}</TableCell>
                <TableCell className='text-muted-foreground'>{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
