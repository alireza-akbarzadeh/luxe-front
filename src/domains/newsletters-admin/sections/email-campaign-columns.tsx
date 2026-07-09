'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import type { ModelsEmailCampaign } from '@/services/-admin-email-campaigns-get.schemas';

export const emailCampaignColumns: ColumnDef<ModelsEmailCampaign>[] = [
  { accessorKey: 'name', header: 'Campaign' },
  { accessorKey: 'subject', header: 'Subject' },
  {
    accessorKey: 'segment',
    header: 'Segment',
    cell: ({ row }) => <span className='capitalize'>{row.original.segment?.replace('_', ' ')}</span>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <Badge variant='outline'>{row.original.status ?? 'draft'}</Badge>
  },
  {
    accessorKey: 'sent_count',
    header: 'Sent',
    cell: ({ row }) => row.original.sent_count ?? 0
  },
  {
    accessorKey: 'scheduled_at',
    header: 'Scheduled',
    cell: ({ row }) =>
      row.original.scheduled_at ? new Date(row.original.scheduled_at).toLocaleString() : '—'
  }
];
