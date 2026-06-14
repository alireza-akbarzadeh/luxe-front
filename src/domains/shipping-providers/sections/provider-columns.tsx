import type { ColumnDef } from '@tanstack/react-table';

import { formatPrice } from '@/domains/home/lib/home-utils';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { createSelectColumn } from '~/src/components/table/data-table';
import type { ModelsShippingProviders } from '~/src/services/-checkout-post.schemas';

export const shippingProviderColumns: ColumnDef<ModelsShippingProviders>[] = [
  createSelectColumn<ModelsShippingProviders>(),

  {
    accessorKey: 'name',
    header: 'Provider',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.name || '—'}</span>
        {row.original.id && (
          <span className='text-muted-foreground text-xs'>ID: {row.original.id}</span>
        )}
      </div>
    )
  },

  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const desc = row.original.description;
      return <span className='line-clamp-2 max-w-[280px] text-sm'>{desc || '—'}</span>;
    }
  },

  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = row.original.price;
      return <span className='font-mono text-sm'>{formatPrice(price ?? 0)}</span>;
    }
  },

  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <div className='flex items-center gap-2'>
          <div
            className={cn('h-2 w-2 rounded-full', isActive ? 'bg-emerald-500' : 'bg-slate-400')}
          />
          <span className='text-xs font-medium uppercase'>{isActive ? 'Active' : 'Inactive'}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.original.created_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>;
    }
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated',
    cell: ({ row }) => {
      const date = row.original.updated_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>;
    }
  }
];
