import type { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { formatPrice } from '~/src/domains/home/lib/home-utils';
import type { ModelsCoupon } from '~/src/services/-coupons-get.schemas';

export const couponColumns: ColumnDef<ModelsCoupon>[] = [
  // Selection column
  {
    id: 'select',
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className='border-muted-foreground/30 rounded-md'
      />
    )
  },

  // Coupon code (primary)
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-mono font-medium'>{row.original.code || '—'}</span>
        {row.original.description && (
          <span className='text-muted-foreground text-xs'>{row.original.description}</span>
        )}
      </div>
    )
  },

  // Discount (type + value)
  {
    id: 'discount',
    header: 'Discount',
    cell: ({ row }) => {
      const type = row.original.discount_type;
      const value = row.original.discount_value ?? 0;
      if (type === 'percentage') {
        return <span>{value}% off</span>;
      }
      return <span>{formatPrice(value)} off</span>;
    }
  },

  // Minimum order amount
  {
    accessorKey: 'minimum_order_amount',
    header: 'Min. order',
    cell: ({ row }) => {
      const amount = row.original.minimum_order_amount;
      return amount ? formatPrice(amount) : '—';
    }
  },

  // Max discount amount (only for percentage)
  {
    accessorKey: 'max_discount_amount',
    header: 'Max discount',
    cell: ({ row }) => {
      const amount = row.original.max_discount_amount;
      return amount ? formatPrice(amount) : '—';
    }
  },

  // Validity period (start – end)
  {
    id: 'validity',
    header: 'Valid period',
    cell: ({ row }) => {
      const start = row.original.start_date;
      const end = row.original.end_date;
      if (!start && !end) return '—';
      const startStr = start ? formatDate(start, DATE_FORMATS.SHORT) : 'anytime';
      const endStr = end ? formatDate(end, DATE_FORMATS.SHORT) : 'forever';
      return (
        <span className='text-xs'>
          {startStr} → {endStr}
        </span>
      );
    }
  },

  // Usage (used / limit)
  {
    id: 'usage',
    header: 'Usage',
    cell: ({ row }) => {
      const used = row.original.used_count ?? 0;
      const limit = row.original.usage_limit;
      if (limit === undefined || limit === null) {
        return <span>{used} / ∞</span>;
      }
      const percentage = (used / limit) * 100;
      return (
        <div className='flex flex-col'>
          <span>
            {used} / {limit}
          </span>
          <div className='bg-muted mt-1 h-1 w-24 overflow-hidden rounded-full'>
            <div
              className={cn(
                'h-full rounded-full',
                percentage >= 90 ? 'bg-destructive' : 'bg-primary'
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      );
    }
  },

  // Status (active / inactive)
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <div className='flex items-center gap-2'>
          <div
            className={cn('h-2 w-2 rounded-full', isActive ? 'bg-emerald-500' : 'bg-slate-400')}
          />
          <span className='text-xs font-medium uppercase'>{isActive ? 'Active' : 'Inactive'}</span>
        </div>
      );
    }
  },

  // Created at
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.original.created_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>;
    }
  },

  // Updated at
  {
    accessorKey: 'updated_at',
    header: 'Updated',
    cell: ({ row }) => {
      const date = row.original.updated_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>;
    }
  }
];
