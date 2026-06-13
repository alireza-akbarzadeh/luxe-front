import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { DATE_FORMATS, formatDate } from '~/src/lib/date';
import type { ModelsCategory } from '~/src/services/-categories-get.schemas'; // adjust import path

export const categoryColumns: ColumnDef<ModelsCategory>[] = [
  {
    id: 'select',
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : false
        }
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        className='border-muted-foreground/30 rounded-md'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className='border-muted-foreground/30 rounded-md'
      />
    )
  },
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
