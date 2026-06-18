import type { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

import { createSelectColumn } from '~/src/components/table/data-table';
import { createWorkflowStateColumn } from '~/src/domains/workflows/lib/create-workflow-state-column';
import { mapBrandStatusToStateView } from '~/src/domains/workflows/lib/workflow-runtime';
import { DATE_FORMATS, formatDate } from '~/src/lib/date';
import type { DtoBrandResponse } from '~/src/services/-brands-get.schemas';

export const brandColumns: ColumnDef<DtoBrandResponse>[] = [
  createSelectColumn<DtoBrandResponse>(),

  {
    id: 'logo',
    header: 'Logo',
    cell: ({ row }) => {
      const logoUrl = row.original.logo_url;
      return (
        <div className='relative h-12 w-12 overflow-hidden rounded-md p-2'>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={row.original.name ?? 'Brand'}
              fill
              className='object-contain'
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
    header: 'Brand',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.name || '—'}</span>
        <span className='text-muted-foreground text-xs'>Slug: {row.original.slug || '—'}</span>
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

  createWorkflowStateColumn<DtoBrandResponse>({
    workflowKey: 'brand',
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
