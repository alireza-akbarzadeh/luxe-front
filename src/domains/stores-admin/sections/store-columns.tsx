import type { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

import { createSelectColumn } from '@/components/table/data-table';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import type { DtoStoreResponse } from '@/services/-stores-get.schemas';

export const storeColumns: ColumnDef<DtoStoreResponse>[] = [
  createSelectColumn<DtoStoreResponse>(),

  {
    accessorKey: 'name',
    header: 'Store',
    cell: ({ row }) => {
      const store = row.original;
      return (
        <div className='flex items-center gap-3'>
          <div className='bg-muted relative h-10 w-10 overflow-hidden rounded-lg border'>
            {store.logo_url ? (
              <Image
                src={store.logo_url}
                alt=''
                fill
                className='object-cover'
                sizes='40px'
              />
            ) : null}
          </div>
          <div className='flex flex-col'>
            <span className='font-medium'>{store.name || '—'}</span>
            <span className='text-muted-foreground text-xs'>{store.slug || '—'}</span>
          </div>
        </div>
      );
    }
  },

  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => <span className='text-sm'>{row.original.location || '—'}</span>
  },

  {
    id: 'rating',
    header: 'Rating',
    cell: ({ row }) => {
      const rating = row.original.rating ?? 0;
      const reviews = row.original.review_count ?? 0;
      return (
        <span className='text-sm tabular-nums'>
          {rating.toFixed(1)} ({reviews})
        </span>
      );
    }
  },

  {
    accessorKey: 'follower_count',
    header: 'Followers',
    cell: ({ row }) => (
      <span className='text-sm tabular-nums'>{(row.original.follower_count ?? 0).toLocaleString()}</span>
    )
  },

  {
    accessorKey: 'is_verified',
    header: 'Verified',
    cell: ({ row }) => {
      const verified = row.original.is_verified;
      return (
        <div className='flex items-center gap-2'>
          <div
            className={cn('h-2 w-2 rounded-full', verified ? 'bg-emerald-500' : 'bg-slate-400')}
          />
          <span className='text-xs font-medium uppercase'>{verified ? 'Yes' : 'No'}</span>
        </div>
      );
    }
  },

  {
    accessorKey: 'joined_at',
    header: 'Joined',
    cell: ({ row }) => {
      const date = row.original.joined_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>;
    }
  }
];
