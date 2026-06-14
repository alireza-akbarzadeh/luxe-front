import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { createSelectColumn } from '~/src/components/table/data-table';
import type { GetUsers200DataUsersItem } from '~/src/services/-users-get.schemas';

export const userColumns: ColumnDef<GetUsers200DataUsersItem>[] = [
  createSelectColumn<GetUsers200DataUsersItem>(),
  {
    accessorKey: 'email',
    header: 'User',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>
          {row.original.first_name || ''} {row.original.last_name || ''}
        </span>
        <span className='text-muted-foreground text-xs'>{row.original.email || '—'}</span>
      </div>
    )
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => <span className='text-sm'>{row.original.phone || '—'}</span>
  },
  {
    accessorKey: 'role',
    header: 'Role',
    filterFn: 'multiSelect',
    cell: ({ row }) => {
      const role = row.original.role || 'user';
      const variant =
        role === 'admin' ? 'destructive' : role === 'moderator' ? 'default' : 'secondary';
      return <Badge variant={variant}>{role}</Badge>;
    }
  },
  {
    id: 'status',
    accessorKey: 'is_active',
    header: 'Status',
    filterFn: 'multiSelect',
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
    filterFn: 'dateRange',
    cell: ({ row }) => {
      const date = row.original.created_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>;
    }
  }
];
