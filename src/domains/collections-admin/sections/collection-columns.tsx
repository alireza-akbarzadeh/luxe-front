import type { ColumnDef } from '@tanstack/react-table';

import { createSelectColumn } from '@/components/table/data-table';
import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import {
  formatScheduleStatusLabel,
  getCollectionScheduleStatus
} from '@/domains/collections-admin/lib/collection-schedule';
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
    accessorKey: 'collection_type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.collection_type ?? 'smart';
      return (
        <Badge variant='outline' className='text-[10px] capitalize'>
          {type}
        </Badge>
      );
    }
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status ?? 'draft';
      const variant =
        status === 'active'
          ? 'default'
          : status === 'scheduled'
            ? 'secondary'
            : status === 'draft'
              ? 'outline'
              : 'outline';
      return (
        <Badge variant={variant} className='text-[10px] capitalize'>
          {status}
        </Badge>
      );
    }
  },

  {
    id: 'schedule',
    header: 'Schedule',
    cell: ({ row }) => {
      const status = getCollectionScheduleStatus(row.original.starts_at, row.original.ends_at);
      return (
        <span className='text-muted-foreground text-xs'>{formatScheduleStatusLabel(status)}</span>
      );
    }
  },

  {
    id: 'smart_rules',
    header: 'Rules',
    cell: ({ row }) => {
      if (row.original.mode === 'manual' || row.original.collection_type === 'manual') {
        const count = row.original.product_ids?.length ?? 0;
        return (
          <span className='text-muted-foreground text-xs'>
            {count ? `${count} product${count === 1 ? '' : 's'}` : 'No products'}
          </span>
        );
      }

      const conditionCount = row.original.rules?.conditions?.length ?? 0;
      const groupCount = row.original.rules?.groups?.length ?? 0;
      if (conditionCount === 0 && groupCount === 0) {
        return <span className='text-muted-foreground text-xs'>No rules</span>;
      }
      return (
        <span className='text-muted-foreground text-xs'>
          {conditionCount} condition{conditionCount === 1 ? '' : 's'}
          {groupCount > 0 ? ` · ${groupCount} group${groupCount === 1 ? '' : 's'}` : ''}
          {row.original.rules?.operator ? ` · ${row.original.rules.operator.toUpperCase()}` : ''}
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
