import type { ColumnDef } from '@tanstack/react-table';

import { createSelectColumn } from '@/components/table/data-table';
import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { createWorkflowStateColumn } from '@/domains/workflows/lib/create-workflow-state-column';
import { mapBrandStatusToStateView } from '@/domains/workflows/lib/workflow-runtime';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoCollectionResponse } from '@/services/-collections-get.schemas';

export const collectionColumns: ColumnDef<DtoCollectionResponse>[] = [
  createSelectColumn<DtoCollectionResponse>(),

  {
    id: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.original.image_url;
      return (
        <div className='bg-muted relative h-12 w-12 overflow-hidden rounded-md border'>
          <AppImage
            src={imageUrl ?? IMAGE_FALLBACK}
            alt={row.original.title ?? 'Collection'}
            fill
            className='object-cover'
            sizes='48px'
          />
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

  {
    id: 'smart_rules',
    header: 'Smart rules',
    cell: ({ row }) => {
      const rules: string[] = [];
      if (row.original.preview_is_new) rules.push('New');
      if (row.original.preview_category_id) rules.push(`Cat #${row.original.preview_category_id}`);
      if (row.original.preview_sort) rules.push(row.original.preview_sort);
      return (
        <span className='text-muted-foreground text-xs'>
          {rules.length ? rules.join(' · ') : 'All products'}
        </span>
      );
    }
  },

  {
    accessorKey: 'theme',
    header: 'Theme',
    cell: ({ row }) =>
      row.original.theme ? (
        <Badge variant='outline' className='text-[10px] capitalize'>
          {row.original.theme}
        </Badge>
      ) : (
        <span className='text-muted-foreground text-xs'>—</span>
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
