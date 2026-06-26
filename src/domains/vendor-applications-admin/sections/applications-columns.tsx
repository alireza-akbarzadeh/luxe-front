'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AdminStoreSummary } from '@/lib/api/vendor-stores';

function statusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'active') return 'default';
  if (status === 'pending') return 'secondary';
  if (status === 'suspended') return 'destructive';
  return 'outline';
}

export function createApplicationColumns(options: {
  onReview: (store: AdminStoreSummary) => void;
}): ColumnDef<AdminStoreSummary>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Store',
      cell: ({ row }) => (
        <div>
          <p className='font-medium'>{row.original.name}</p>
          <p className='text-muted-foreground text-xs'>{row.original.slug}</p>
        </div>
      )
    },
    {
      id: 'owner',
      header: 'Owner',
      cell: ({ row }) => <span className='text-sm'>{row.original.owner_email ?? '—'}</span>
    },
    {
      id: 'country',
      header: 'Country',
      cell: ({ row }) => (
        <span className='text-sm'>{row.original.settings?.['country'] ?? '—'}</span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={statusVariant(row.original.status)} className='capitalize'>
          {row.original.status}
        </Badge>
      )
    },
    {
      accessorKey: 'created_at',
      header: 'Submitted',
      cell: ({ row }) =>
        row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : '—'
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={() => options.onReview(row.original)}
        >
          Review
        </Button>
      )
    }
  ];
}
