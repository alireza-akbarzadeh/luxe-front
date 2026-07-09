'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { createSelectColumn } from '@/components/table/data-table';
import { Badge } from '@/components/ui/badge';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import type { ModelsFlashDeal } from '@/services/-admin-flash-deals-get.schemas';

export const flashDealColumns: ColumnDef<ModelsFlashDeal>[] = [
  createSelectColumn<ModelsFlashDeal>(),
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.title || 'Flash sale'}</span>
        <span className='text-muted-foreground text-xs'>Product #{row.original.product_id}</span>
      </div>
    )
  },
  {
    id: 'schedule',
    header: 'Schedule',
    cell: ({ row }) => (
      <span className='text-xs'>
        {row.original.starts_at ? formatDate(row.original.starts_at, DATE_FORMATS.SHORT) : 'Now'} →{' '}
        {row.original.ends_at ? formatDate(row.original.ends_at, DATE_FORMATS.SHORT) : '—'}
      </span>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant='secondary' className='font-normal capitalize'>
        {row.original.status ?? 'draft'}
      </Badge>
    )
  },
  {
    accessorKey: 'sort_order',
    header: 'Order',
    cell: ({ row }) => row.original.sort_order ?? 0
  }
];
