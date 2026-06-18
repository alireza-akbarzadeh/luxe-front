'use client';

import { IconShield } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { UserRoleBadge } from '@/domains/users/components/user-role-badge';
import { UserRoleDialog } from '@/domains/users/components/user-role-dialog';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { getGetAdminStatsQueryKey } from '@/services/-admin-stats-get';
import { getGetAdminUsersQueryKey } from '@/services/-admin-users-get';
import type { DtoAdminUserResponse } from '@/services/-admin-users-get.schemas';

interface UserDetailSheetProps {
  user: DtoAdminUserResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className='border-border/40 flex items-start justify-between gap-4 border-b py-3 last:border-b-0'>
      <span className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
        {label}
      </span>
      <span className='text-right text-sm font-medium'>{value}</span>
    </div>
  );
}

export function UserDetailSheet({ user, open, onOpenChange }: UserDetailSheetProps) {
  const queryClient = useQueryClient();
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Unnamed user';

  const invalidateUsers = () => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminUsersQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className='w-full sm:max-w-md'>
          <SheetHeader>
            <SheetTitle>{fullName}</SheetTitle>
            <SheetDescription>{user?.email ?? 'No email on file'}</SheetDescription>
          </SheetHeader>

          <div className='mt-6 px-1'>
            <DetailRow label='User ID' value={user?.id ?? '—'} />
            <DetailRow
              label='Role'
              value={
                <div className='flex flex-col items-end gap-2'>
                  <UserRoleBadge slug={user?.role} />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='h-8 gap-2 rounded-xl text-[10px] font-bold uppercase'
                    onClick={() => setRoleDialogOpen(true)}
                  >
                    <IconShield className='h-3.5 w-3.5' />
                    Change role
                  </Button>
                </div>
              }
            />
            <DetailRow
              label='Status'
              value={
                <span className='inline-flex items-center gap-2'>
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      user?.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                    )}
                  />
                  {user?.is_active ? 'Active' : 'Inactive'}
                </span>
              }
            />
            <DetailRow
              label='Email Verified'
              value={
                user?.email_verified_at
                  ? formatDate(user.email_verified_at, DATE_FORMATS.WITH_TIME)
                  : 'Not verified'
              }
            />
            <DetailRow
              label='Last Login'
              value={
                user?.last_login_at
                  ? formatDate(user.last_login_at, DATE_FORMATS.WITH_TIME)
                  : 'Never'
              }
            />
            <DetailRow
              label='Created'
              value={
                user?.created_at ? formatDate(user.created_at, DATE_FORMATS.WITH_TIME) : '—'
              }
            />
          </div>
        </SheetContent>
      </Sheet>

      <UserRoleDialog
        user={user}
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onSuccess={invalidateUsers}
      />
    </>
  );
}
