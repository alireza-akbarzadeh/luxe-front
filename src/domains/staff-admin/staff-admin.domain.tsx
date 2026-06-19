'use client';

import Link from 'next/link';
import { IconRotateClockwise2, IconShield } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { UserManagementTable } from '@/domains/users/sections/user-table';
import { getGetAdminUsersQueryKey } from '@/services/-admin-users-get';

export function StaffAdminDomain() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminUsersQueryKey() });
  };

  return (
    <div className='space-y-8'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl'>
            <IconShield className='text-primary size-5' />
          </div>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>Staff</h1>
            <p className='text-muted-foreground mt-1 text-sm'>
              Admin and staff accounts. Manage roles in{' '}
              <Link href='/dashboard/roles' className='text-primary underline'>
                Roles &amp; permissions
              </Link>
              ; all customers are under{' '}
              <Link href='/dashboard/users' className='text-primary underline'>
                Users
              </Link>
              .
            </p>
          </div>
        </div>
        <Button variant='outline' size='sm' className='gap-2' onClick={handleRefresh}>
          <IconRotateClockwise2 className='size-4' />
          Refresh
        </Button>
      </div>

      <div className='border-border/40 bg-card/30 rounded-2xl border p-1 shadow-sm'>
        <UserManagementTable defaultSegment='admins' />
      </div>
    </div>
  );
}
