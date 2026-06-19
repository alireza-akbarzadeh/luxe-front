import { IconEye } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { InvoiceStatusBadge } from '@/domains/invoices-admin/components/invoice-status-badge';
import { formatCurrency } from '@/lib/format';
import type { DtoAdminInvoiceListItem } from '@/services/-admin-invoices-get.schemas';

function formatInvoiceDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy · h:mm a');
}

export const invoiceColumns: ColumnDef<DtoAdminInvoiceListItem>[] = [
  {
    accessorKey: 'invoice_number',
    header: 'Invoice',
    cell: ({ row }) => (
      <div className='min-w-28'>
        <p className='font-mono text-xs font-semibold'>{row.original.invoice_number ?? '—'}</p>
      </div>
    )
  },

  {
    accessorKey: 'order_number',
    header: 'Order',
    cell: ({ row }) => {
      const orderId = row.original.order_id;
      const orderNumber = row.original.order_number ?? (orderId ? `#${orderId}` : '—');

      if (!orderId) {
        return <span className='font-mono text-xs'>{orderNumber}</span>;
      }

      return (
        <Link
          href={`/dashboard/orders/${orderId}`}
          className='text-primary font-mono text-xs font-semibold hover:underline'
          onClick={(event) => event.stopPropagation()}
        >
          {orderNumber}
        </Link>
      );
    }
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <InvoiceStatusBadge status={row.original.status} />
  },

  {
    accessorKey: 'customer_name',
    header: 'Customer',
    cell: ({ row }) => (
      <div className='min-w-32'>
        <p className='text-xs font-medium'>{row.original.customer_name?.trim() || '—'}</p>
        {row.original.customer_email ? (
          <p className='text-muted-foreground truncate text-[10px]'>{row.original.customer_email}</p>
        ) : null}
      </div>
    )
  },

  {
    accessorKey: 'total_amount',
    header: 'Amount',
    cell: ({ row }) => (
      <span className='text-sm font-semibold tabular-nums'>
        {formatCurrency(row.original.total_amount ?? 0, row.original.currency ?? 'USD')}
      </span>
    )
  },

  {
    accessorKey: 'issued_at',
    header: 'Issued',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs tabular-nums'>
        {formatInvoiceDate(row.original.issued_at ?? row.original.created_at)}
      </span>
    )
  },

  {
    accessorKey: 'paid_at',
    header: 'Paid',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs tabular-nums'>
        {formatInvoiceDate(row.original.paid_at)}
      </span>
    )
  }
];

export function invoiceRowMenuActions(
  invoice: DtoAdminInvoiceListItem,
  onView: (id: number) => void
) {
  const id = invoice.id;
  if (!id) return null;

  return (
    <DropdownMenuItem className='gap-2 text-[11px] font-semibold' onClick={() => onView(id)}>
      <IconEye className='size-3.5' />
      View invoice
    </DropdownMenuItem>
  );
}
