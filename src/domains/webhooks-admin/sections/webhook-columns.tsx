import type { ColumnDef } from '@tanstack/react-table';

import { WebhookStatusBadge } from '@/domains/webhooks-admin/components/webhook-status-badge';
import type { WebhookEvent } from '@/domains/webhooks-admin/lib/webhook-list';
import { DATE_FORMATS, formatDate } from '@/lib/date';

export const webhookColumns: ColumnDef<WebhookEvent>[] = [
  {
    accessorKey: 'event_id',
    header: 'Event ID',
    cell: ({ row }) => (
      <span className='font-mono text-xs'>{row.original.event_id || '—'}</span>
    )
  },

  {
    accessorKey: 'event_type',
    header: 'Type',
    cell: ({ row }) => (
      <span className='line-clamp-2 max-w-[280px] text-sm'>{row.original.event_type || '—'}</span>
    )
  },

  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) => (
      <span className='text-xs font-semibold uppercase'>{row.original.source || '—'}</span>
    )
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <WebhookStatusBadge status={row.original.status ?? 'unknown'} />
  },

  {
    accessorKey: 'created_at',
    header: 'Received',
    cell: ({ row }) => {
      const date = row.original.created_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.WITH_TIME) : '—'}</div>;
    }
  },

  {
    accessorKey: 'processed_at',
    header: 'Processed',
    cell: ({ row }) => {
      const date = row.original.processed_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.WITH_TIME) : '—'}</div>;
    }
  },

  {
    accessorKey: 'error_msg',
    header: 'Error',
    cell: ({ row }) => {
      const error = row.original.error_msg;
      if (!error) return <span className='text-muted-foreground'>—</span>;
      return <span className='text-destructive line-clamp-2 max-w-[220px] text-xs'>{error}</span>;
    }
  }
];
