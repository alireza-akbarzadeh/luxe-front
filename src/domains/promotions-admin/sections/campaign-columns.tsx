'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { createSelectColumn } from '@/components/table/data-table';
import { Badge } from '@/components/ui/badge';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import type { ModelsCampaign } from '@/services/-admin-campaigns-get.schemas';

export const campaignColumns: ColumnDef<ModelsCampaign>[] = [
  createSelectColumn<ModelsCampaign>(),
  {
    accessorKey: 'name',
    header: 'Campaign',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.name}</span>
        <span className='text-muted-foreground font-mono text-xs'>{row.original.slug}</span>
      </div>
    )
  },
  {
    id: 'schedule',
    header: 'Schedule',
    cell: ({ row }) => (
      <span className='text-xs'>
        {row.original.starts_at ? formatDate(row.original.starts_at, DATE_FORMATS.SHORT) : 'Open'} →{' '}
        {row.original.ends_at ? formatDate(row.original.ends_at, DATE_FORMATS.SHORT) : 'Open'}
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
  }
];
