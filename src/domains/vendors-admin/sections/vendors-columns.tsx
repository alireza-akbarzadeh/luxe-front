'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VendorStatusBadge } from '@/domains/vendors-admin/components/vendor-status-badge';
import type { DtoAdminStoreResponse } from '@/services/-admin-stores-get.schemas';

export function createVendorColumns(options: {
  onOpen: (store: DtoAdminStoreResponse) => void;
}): ColumnDef<DtoAdminStoreResponse>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Vendor',
      cell: ({ row }) => (
        <div>
          <p className='font-medium'>{row.original.name ?? '—'}</p>
          <p className='text-muted-foreground text-xs'>{row.original.slug ?? '—'}</p>
        </div>
      )
    },
    {
      id: 'owner',
      header: 'Owner',
      cell: ({ row }) => <span className='text-sm'>{row.original.owner_email ?? '—'}</span>
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => <span className='text-sm'>{row.original.location ?? '—'}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <VendorStatusBadge status={row.original.status} />
    },
    {
      id: 'verified',
      header: 'Verified',
      cell: ({ row }) =>
        row.original.is_verified ? (
          <Badge variant='default'>Verified</Badge>
        ) : (
          <Badge variant='outline'>Unverified</Badge>
        )
    },
    {
      accessorKey: 'created_at',
      header: 'Joined',
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
          onClick={() => options.onOpen(row.original)}
          disabled={!row.original.id}
        >
          Manage
        </Button>
      )
    }
  ];
}
