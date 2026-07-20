import { IconEye } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ApiPaymentStatusBadge } from '@/domains/orders/components/order-api-badges';
import { WalletTypeBadge } from '@/domains/transactions-admin/components/wallet-type-badge';
import { formatCurrency } from '@/lib/format';
import type { DtoAdminWalletTxListItem } from '@/services/-admin-wallet-transactions-get.schemas';

function formatTxDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy · h:mm a');
}

export const walletColumns: ColumnDef<DtoAdminWalletTxListItem>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <span className='font-mono text-xs font-semibold'>#{row.original.id ?? '—'}</span>
    )
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <WalletTypeBadge type={row.original.type} />
  },
  {
    accessorKey: 'customer_name',
    header: 'Customer',
    cell: ({ row }) => (
      <div className='min-w-32'>
        <p className='text-xs font-medium'>{row.original.customer_name?.trim() || '—'}</p>
        {row.original.customer_email ? (
          <p className='text-muted-foreground truncate text-[10px]'>
            {row.original.customer_email}
          </p>
        ) : null}
      </div>
    )
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.original.amount ?? 0;
      const isCredit = amount >= 0;
      return (
        <span
          className={`text-sm font-semibold tabular-nums ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
        >
          {isCredit ? '+' : ''}
          {formatCurrency(amount, 'USD')}
        </span>
      );
    }
  },
  {
    accessorKey: 'balance_after',
    header: 'Balance after',
    cell: ({ row }) => (
      <span className='text-xs font-semibold tabular-nums'>
        {formatCurrency(row.original.balance_after ?? 0, 'USD')}
      </span>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <ApiPaymentStatusBadge status={row.original.status} />
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <span className='text-muted-foreground max-w-40 truncate text-xs'>
        {row.original.description ?? '—'}
      </span>
    )
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs tabular-nums'>
        {formatTxDate(row.original.created_at)}
      </span>
    )
  }
];

export function walletRowMenuActions(tx: DtoAdminWalletTxListItem, onView: (id: number) => void) {
  const id = tx.id;
  if (!id) return null;

  return (
    <DropdownMenuItem className='gap-2 text-[11px] font-semibold' onClick={() => onView(id)}>
      <IconEye className='size-3.5' />
      View transaction
    </DropdownMenuItem>
  );
}
