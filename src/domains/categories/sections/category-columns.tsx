import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { createSelectColumn } from '~/src/components/table/data-table';
import { createWorkflowStateColumn } from '~/src/domains/workflows/lib/create-workflow-state-column';
import { mapCategoryActiveToStateView } from '~/src/domains/workflows/lib/workflow-runtime';
import { DATE_FORMATS, formatDate } from '~/src/lib/date';
import type { ModelsCategory } from '~/src/services/-categories-get.schemas'; // adjust import path

export const categoryColumns: ColumnDef<ModelsCategory>[] = [
  createSelectColumn<ModelsCategory>(),
  {
    id: 'expander',
    header: '',
    cell: ({ row }) => {
      const hasChildren = (row.original.children?.length ?? 0) > 0;
      return (
        <button
          onClick={(event) => {
            event.stopPropagation();
            row.toggleExpanded();
          }}
          className='text-muted-foreground hover:text-foreground ml-4 h-5 w-5'
        >
          {hasChildren ? (
            row.getIsExpanded() ? (
              <IconChevronDown size={16} />
            ) : (
              <IconChevronRight size={16} />
            )
          ) : (
            <div className='w-5' />
          )}
        </button>
      );
    }
  },
  {
    accessorKey: 'name',
    header: 'Category',
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

  {
    accessorKey: 'parent',
    header: 'Parent',
    cell: ({ row }) => (
      <span className='text-sm'>
        {row.original.parent?.name || (row.original.parent_id ? 'Unknown' : '—')}
      </span>
    )
  },

  {
    accessorKey: 'level',
    header: 'Level',
    cell: ({ row }) => (
      <div className='text-center'>
        <Badge variant='outline' className='font-mono text-xs'>
          {row.original.level ?? 0}
        </Badge>
      </div>
    )
  },

  createWorkflowStateColumn<ModelsCategory>({
    workflowKey: 'category',
    getEntityId: (row) => row.id,
    getState: (row) => row.workflow_state ?? mapCategoryActiveToStateView(row.is_active),
    header: 'Workflow'
  }),

  {
    accessorKey: 'path',
    header: 'Path',
    cell: ({ row }) => (
      <span className='text-muted-foreground font-mono text-xs'>{row.original.path || '/'}</span>
    )
  },

  {
    id: 'children_count',
    header: 'Children',
    cell: ({ row }) => {
      const count = row.original.children?.length ?? 0;
      return (
        <Badge variant='secondary' className='text-xs'>
          {count}
        </Badge>
      );
    }
  },

  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.original.created_at;
      return (
        <div className='w-20 text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>
      );
    }
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated',
    cell: ({ row }) => {
      const date = row.original.updated_at;
      return (
        <div className='w-20 text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>
      );
    }
  }
];
