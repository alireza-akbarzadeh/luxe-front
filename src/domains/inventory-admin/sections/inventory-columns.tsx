import type { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { createSelectColumn } from '~/src/components/table/data-table';
import { createWorkflowStateColumn } from '~/src/domains/workflows/lib/create-workflow-state-column';
import { mapBrandStatusToStateView } from '~/src/domains/workflows/lib/workflow-runtime';
import type { DtoInventoryItemResponse } from '~/src/services/-admin-inventory.schemas';

function stockStatusLabel(status?: string) {
  switch (status) {
    case 'low':
      return 'Low stock';
    case 'out':
      return 'Out of stock';
    case 'healthy':
      return 'In stock';
    case 'not_tracked':
      return 'Not tracked';
    default:
      return '—';
  }
}

function stockStatusVariant(status?: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'low':
      return 'secondary';
    case 'out':
      return 'destructive';
    case 'healthy':
      return 'default';
    default:
      return 'outline';
  }
}

export const inventoryColumns: ColumnDef<DtoInventoryItemResponse>[] = [
  createSelectColumn<DtoInventoryItemResponse>(),

  {
    id: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.original.image_url;
      return (
        <div className='bg-muted relative h-12 w-12 overflow-hidden rounded-md border'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={row.original.name ?? 'Product'}
              fill
              className='object-cover'
              sizes='48px'
            />
          ) : (
            <div className='text-muted-foreground flex h-full w-full items-center justify-center text-xs'>
              —
            </div>
          )}
        </div>
      );
    }
  },

  {
    accessorKey: 'name',
    header: 'Product',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.name || '—'}</span>
        <span className='text-muted-foreground font-mono text-xs'>{row.original.sku || '—'}</span>
      </div>
    )
  },

  {
    accessorKey: 'stock',
    header: 'On hand',
    cell: ({ row }) => {
      const stock = row.original.stock ?? 0;
      const threshold = row.original.low_stock_threshold ?? 0;
      const tracked = row.original.track_inventory !== false;
      return (
        <div className='flex flex-col'>
          <span
            className={cn(
              'font-semibold tabular-nums',
              tracked && stock === 0 && 'text-destructive',
              tracked && stock > 0 && stock <= threshold && 'text-amber-600'
            )}
          >
            {tracked ? stock : '—'}
          </span>
          {tracked ? (
            <span className='text-muted-foreground text-[10px]'>threshold {threshold}</span>
          ) : null}
        </div>
      );
    }
  },

  {
    accessorKey: 'stock_status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={stockStatusVariant(row.original.stock_status)}>
        {stockStatusLabel(row.original.stock_status)}
      </Badge>
    )
  },

  {
    accessorKey: 'units_sold_30d',
    header: 'Sold (30d)',
    cell: ({ row }) => (
      <span className='tabular-nums'>{(row.original.units_sold_30d ?? 0).toLocaleString()}</span>
    )
  },

  {
    accessorKey: 'waitlist_count',
    header: 'Waitlist',
    cell: ({ row }) => {
      const count = row.original.waitlist_count ?? 0;
      return count > 0 ? (
        <Badge variant='outline' className='font-mono text-xs'>
          {count}
        </Badge>
      ) : (
        <span className='text-muted-foreground text-xs'>—</span>
      );
    }
  },

  {
    accessorKey: 'warehouse_location',
    header: 'Location',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs'>{row.original.warehouse_location || '—'}</span>
    )
  },

  createWorkflowStateColumn<DtoInventoryItemResponse>({
    workflowKey: 'product',
    getEntityId: (row) => row.id,
    getState: (row) => row.workflow_state ?? mapBrandStatusToStateView(row.status),
    header: 'Workflow'
  })
];
