'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { createSelectColumn } from '@/components/table/data-table';
import { createWorkflowStateColumn } from '@/domains/workflows/lib/create-workflow-state-column';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import type { ModelsCoupon } from '@/services/-admin-coupons-get.schemas';

import { formatPrice } from '../lib/discount-utils';

export const couponColumns: ColumnDef<ModelsCoupon>[] = [
  createSelectColumn<ModelsCoupon>(),

  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-mono font-medium'>{row.original.code || '—'}</span>
        {row.original.description ? (
          <span className='text-muted-foreground text-xs'>{row.original.description}</span>
        ) : null}
      </div>
    )
  },

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

  {
    accessorKey: 'minimum_order_amount',
    header: 'Min. order',
    cell: ({ row }) => {
      const amount = row.original.minimum_order_amount;
      return amount ? formatPrice(amount) : '—';
    }
  },

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

  {
    id: 'usage',
    header: 'Usage',
    cell: ({ row }) => {
      const used = row.original.used_count ?? 0;
      const limit = row.original.usage_limit;
      if (limit === undefined || limit === null || limit === 0) {
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

  createWorkflowStateColumn<ModelsCoupon>({
    workflowKey: 'coupon',
    getEntityId: (row) => row.id,
    getState: (row) => row.workflow_state,
    header: 'Status'
  }),

  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.original.created_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>;
    }
  }
];
