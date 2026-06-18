import type { ColumnDef } from '@tanstack/react-table';

import { AuditActionBadge } from '@/domains/audit/components/audit-action-badge';
import { DATE_FORMATS, formatDate, timeFromNow } from '@/lib/date';
import { cn } from '@/lib/utils';
import type { DtoAuditLogResponse } from '@/services/-admin-audit-logs-get.schemas';

function shortenResource(resource: string) {
  return resource.replace('/api/v1', '').replace(/\/:id/g, '') || resource;
}

export const auditColumns: ColumnDef<DtoAuditLogResponse>[] = [
  {
    accessorKey: 'created_at',
    header: 'When',
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      if (!createdAt) return '—';
      return (
        <div className='flex flex-col'>
          <span className='text-xs font-medium'>{formatDate(createdAt, DATE_FORMATS.WITH_TIME)}</span>
          <span className='text-muted-foreground text-[10px]'>{timeFromNow(createdAt)}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'action',
    header: 'Action',
    filterFn: 'multiSelect',
    cell: ({ row }) => <AuditActionBadge action={row.original.action ?? '—'} />
  },
  {
    accessorKey: 'user_email',
    header: 'Actor',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='max-w-44 truncate text-xs font-medium'>
          {row.original.user_email || `User #${row.original.user_id ?? '—'}`}
        </span>
        {row.original.user_id ? (
          <span className='text-muted-foreground text-[10px]'>ID {row.original.user_id}</span>
        ) : null}
      </div>
    )
  },
  {
    accessorKey: 'resource',
    header: 'Resource',
    filterFn: 'multiSelect',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='max-w-56 truncate font-mono text-xs' title={row.original.resource}>
          {row.original.resource ? shortenResource(row.original.resource) : '—'}
        </span>
        {row.original.resource_id ? (
          <span className='text-muted-foreground text-[10px]'>#{row.original.resource_id}</span>
        ) : null}
      </div>
    )
  },
  {
    accessorKey: 'path',
    header: 'Path',
    cell: ({ row }) => (
      <span className='text-muted-foreground block max-w-52 truncate font-mono text-[11px]'>
        {row.original.path || '—'}
      </span>
    )
  },
  {
    accessorKey: 'ip_address',
    header: 'IP',
    cell: ({ row }) => (
      <span className={cn('font-mono text-[11px]', !row.original.ip_address && 'text-muted-foreground')}>
        {row.original.ip_address || '—'}
      </span>
    )
  }
];
