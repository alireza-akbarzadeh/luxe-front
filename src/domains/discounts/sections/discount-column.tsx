'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { createSelectColumn } from '@/components/table/data-table';
import { Badge } from '@/components/ui/badge';
import { formatApplicationTypeLabel } from '@/domains/discounts/lib/coupon-labels';
import { formatCouponScheduleLabel } from '@/domains/discounts/lib/coupon-schedule';
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
    id: 'application_type',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant='secondary' className='font-normal'>
        {formatApplicationTypeLabel(row.original.application_type)}
      </Badge>
    )
  },

  {
    id: 'discount',
    header: 'Discount',
    cell: ({ row }) => {
      if (row.original.application_type === 'bogo') {
        const buy = row.original.bogo_buy_quantity ?? 1;
        const get = row.original.bogo_get_quantity ?? 1;
        const percent = row.original.bogo_get_discount_percent ?? 100;
        return (
          <span>
            Buy {buy} get {get} ({percent}% off)
          </span>
        );
      }

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
    header: 'Schedule',
    cell: ({ row }) => (
      <span className='text-xs'>
        {formatCouponScheduleLabel(row.original.start_date, row.original.end_date)}
      </span>
    )
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
