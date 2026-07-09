import { IconEye } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { CustomerSegmentBadge } from '@/domains/customers-admin/components/customer-segment-badge';
import { LoyaltyBadge } from '@/domains/customers-admin/components/loyalty-badge';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { formatCurrency } from '@/lib/format';
import type { DtoAdminUserResponse } from '@/services/-admin-users-get.schemas';
import { createSelectColumn } from '~/src/components/table/data-table';

export const customerColumns: ColumnDef<DtoAdminUserResponse>[] = [
  createSelectColumn<DtoAdminUserResponse>(),
  {
    accessorKey: 'email',
    header: 'Customer',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>
          {[row.original.first_name, row.original.last_name].filter(Boolean).join(' ') ||
            'Unnamed customer'}
        </span>
        <span className='text-muted-foreground text-xs'>{row.original.email || '—'}</span>
      </div>
    )
  },
  {
    id: 'segment',
    accessorKey: 'customer_segment',
    header: 'Segment',
    cell: ({ row }) => <CustomerSegmentBadge segment={row.original.customer_segment} />
  },
  {
    id: 'loyalty',
    header: 'Loyalty',
    cell: ({ row }) => (
      <LoyaltyBadge
        tier={row.original.membership_tier}
        isPlusActive={row.original.is_plus_active}
      />
    )
  },
  {
    accessorKey: 'order_count',
    header: 'Orders',
    cell: ({ row }) => <span className='text-xs tabular-nums'>{row.original.order_count ?? 0}</span>
  },
  {
    accessorKey: 'total_spent',
    header: 'Lifetime value',
    cell: ({ row }) => (
      <span className='text-xs font-medium tabular-nums'>
        {formatCurrency(row.original.total_spent ?? 0)}
      </span>
    )
  },
  {
    accessorKey: 'last_login_at',
    header: 'Last login',
    cell: ({ row }) => {
      const lastLogin = row.original.last_login_at;
      return (
        <span className='text-xs'>
          {lastLogin ? formatDate(lastLogin, DATE_FORMATS.SHORT) : 'Never'}
        </span>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Joined',
    cell: ({ row }) => {
      const date = row.original.created_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>;
    }
  }
];

export function customerRowMenuActions(
  customer: DtoAdminUserResponse,
  onView: (id: number) => void
) {
  const id = customer.id;
  if (!id) return null;

  return (
    <DropdownMenuItem className='gap-2 text-[11px] font-semibold' onClick={() => onView(id)}>
      <IconEye className='size-3.5' />
      View profile
    </DropdownMenuItem>
  );
}
