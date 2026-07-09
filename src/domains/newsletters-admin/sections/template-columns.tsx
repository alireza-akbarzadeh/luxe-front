'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import type { ModelsEmailTemplate } from '@/services/-admin-email-templates-get.schemas';

export const templateColumns: ColumnDef<ModelsEmailTemplate>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'slug', header: 'Slug' },
  { accessorKey: 'subject', header: 'Subject' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <Badge variant='outline'>{row.original.status ?? 'draft'}</Badge>
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated',
    cell: ({ row }) =>
      row.original.updated_at ? new Date(row.original.updated_at).toLocaleDateString() : '—'
  }
];
