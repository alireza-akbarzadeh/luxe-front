import type { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { createSelectColumn } from '~/src/components/table/data-table';
import { createWorkflowStateColumn } from '~/src/domains/workflows/lib/create-workflow-state-column';
import { mapBrandStatusToStateView } from '~/src/domains/workflows/lib/workflow-runtime';
import { DATE_FORMATS, formatDate } from '~/src/lib/date';
import type { DtoCollectionResponse } from '~/src/services/-collections-get.schemas';

export const collectionColumns: ColumnDef<DtoCollectionResponse>[] = [
  createSelectColumn<DtoCollectionResponse>(),

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
              alt={row.original.title ?? 'Collection'}
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
    accessorKey: 'title',
    header: 'Collection',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.title || '—'}</span>
        <span className='text-muted-foreground text-xs'>
          {row.original.eyebrow || '—'} · /{row.original.slug || '—'}
        </span>
      </div>
    )
  },

  {
    accessorKey: 'href',
    header: 'Link',
    cell: ({ row }) => (
      <span className='text-muted-foreground font-mono text-xs'>{row.original.href || '—'}</span>
    )
  },

  {
    accessorKey: 'sort_order',
    header: 'Order',
    cell: ({ row }) => (
      <Badge variant='outline' className='font-mono text-xs'>
        {row.original.sort_order ?? 0}
      </Badge>
    )
  },

  createWorkflowStateColumn<DtoCollectionResponse>({
    workflowKey: 'collection',
    getEntityId: (row) => row.id,
    getState: (row) => row.workflow_state ?? mapBrandStatusToStateView(row.status),
    header: 'Workflow'
  }),

  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.original.created_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>;
    }
  }
];
