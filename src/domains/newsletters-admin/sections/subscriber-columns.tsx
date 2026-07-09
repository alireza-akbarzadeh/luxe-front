'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import type { ModelsNewsletterSubscriber } from '@/services/-admin-newsletter-subscribers-get.schemas';

export const subscriberColumns: ColumnDef<ModelsNewsletterSubscriber>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <span className='font-medium'>{row.original.email}</span>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'subscribed' ? 'default' : 'secondary'}>
        {row.original.status ?? 'unknown'}
      </Badge>
    )
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) => <span className='capitalize'>{row.original.source ?? '—'}</span>
  },
  {
    accessorKey: 'subscribed_at',
    header: 'Subscribed',
    cell: ({ row }) =>
      row.original.subscribed_at ? new Date(row.original.subscribed_at).toLocaleDateString() : '—'
  }
];
