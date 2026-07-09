'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { createSelectColumn } from '@/components/table/data-table';
import { Badge } from '@/components/ui/badge';
import type { ModelsHomepageSection } from '@/services/-admin-homepage-sections-get.schemas';

export const bannerColumns: ColumnDef<ModelsHomepageSection>[] = [
  createSelectColumn<ModelsHomepageSection>(),
  {
    accessorKey: 'title',
    header: 'Banner',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.title}</span>
        <span className='text-muted-foreground font-mono text-xs'>{row.original.section_key}</span>
      </div>
    )
  },
  {
    accessorKey: 'href',
    header: 'Link',
    cell: ({ row }) => <span className='text-xs'>{row.original.href}</span>
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
