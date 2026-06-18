import type { ColumnDef } from '@tanstack/react-table';

import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import type { DtoAdminUserResponse } from '@/services/-admin-users-get.schemas';
import { createSelectColumn } from '~/src/components/table/data-table';

import { UserActions } from './user-actions';
import { UserRoleBadge } from './user-role-badge';

export const userColumns: ColumnDef<DtoAdminUserResponse>[] = [
  createSelectColumn<DtoAdminUserResponse>(),
  {
    accessorKey: 'email',
    header: 'User',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>
          {[row.original.first_name, row.original.last_name].filter(Boolean).join(' ') ||
            'Unnamed user'}
        </span>
        <span className='text-muted-foreground text-xs'>{row.original.email || '—'}</span>
      </div>
    )
  },
  {
    accessorKey: 'role',
    header: 'Role',
    filterFn: 'multiSelect',
    cell: ({ row }) => <UserRoleBadge slug={row.original.role} />
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
    accessorKey: 'email_verified_at',
    header: 'Verified',
    cell: ({ row }) => {
      const verifiedAt = row.original.email_verified_at;
      return (
        <span className='text-xs'>
          {verifiedAt ? formatDate(verifiedAt, DATE_FORMATS.SHORT) : 'No'}
        </span>
      );
    }
  },
  {
    accessorKey: 'last_login_at',
    header: 'Last Login',
    cell: ({ row }) => {
      const lastLogin = row.original.last_login_at;
      return (
        <span className='text-xs'>
          {lastLogin ? formatDate(lastLogin, DATE_FORMATS.SHORT) : 'Never'}
        </span>
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
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <UserActions user={row.original} />,
    enableSorting: false,
    enableHiding: false
  }
];
