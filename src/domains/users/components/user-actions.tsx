'use client';

import {
  IconDotsVertical,
  IconShield,
  IconUserCheck,
  IconUserMinus
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserRoleDialog } from '@/domains/users/components/user-role-dialog';
import { getGetAdminStatsQueryKey } from '@/services/-admin-stats-get';
import { usePatchAdminUsersIdActive } from '@/services/-admin-users-{id}-active-patch';
import { getGetAdminUsersQueryKey } from '@/services/-admin-users-get';
import type { DtoAdminUserResponse } from '@/services/-admin-users-get.schemas';

interface UserActionsProps {
  user: DtoAdminUserResponse;
}

type PendingAction = 'activate' | 'deactivate' | null;

export function UserActions({ user }: UserActionsProps) {
  const queryClient = useQueryClient();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const userId = user.id;
  const isActive = user.is_active ?? false;

  const invalidateUsers = () => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminUsersQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
  };

  const activeMutation = usePatchAdminUsersIdActive({
    mutation: {
      onSuccess: () => {
        invalidateUsers();
        toast.success(isActive ? 'User deactivated' : 'User activated');
        setPendingAction(null);
      },
      onError: () => {
        toast.error('Failed to update user status');
        setPendingAction(null);
      }
    }
  });

  const isPending = activeMutation.isPending;

  const handleConfirm = () => {
    if (!userId || !pendingAction) return;

    switch (pendingAction) {
      case 'activate':
        activeMutation.mutate({ id: userId, data: { is_active: true } });
        break;
      case 'deactivate':
        activeMutation.mutate({ id: userId, data: { is_active: false } });
        break;
    }
  };

  const dialogCopy = {
    activate: {
      title: 'Activate this account?',
      description: `${user.email ?? 'This user'} will be able to sign in again.`
    },
    deactivate: {
      title: 'Deactivate this account?',
      description: `${user.email ?? 'This user'} will be blocked from signing in until reactivated.`
    }
  } as const;

  const copy = pendingAction ? dialogCopy[pendingAction] : null;

  if (!userId) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='hover:bg-muted h-8 w-8 p-0 focus-visible:ring-0'
            disabled={isPending}
          >
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='border-border/50 w-56 rounded-2xl p-2 shadow-xl'>
          <div className='mb-1 flex flex-col px-2 py-2'>
            <span className='text-muted-foreground text-[10px] leading-none font-black tracking-widest uppercase'>
              User #{userId}
            </span>
            <span className='text-primary mt-1.5 truncate text-[11px] font-medium'>
              {user.email ?? 'No email'}
            </span>
          </div>
          <DropdownMenuSeparator className='my-2' />
          <DropdownMenuItem
            className='gap-2 rounded-xl py-2 text-xs font-medium'
            onClick={() => setRoleDialogOpen(true)}
          >
            <IconShield className='h-4 w-4' />
            Change role
          </DropdownMenuItem>
          {isActive ? (
            <DropdownMenuItem
              className='text-destructive focus:text-destructive gap-2 rounded-xl py-2 text-xs font-medium'
              onClick={() => setPendingAction('deactivate')}
            >
              <IconUserMinus className='h-4 w-4' />
              Deactivate account
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className='gap-2 rounded-xl py-2 text-xs font-medium'
              onClick={() => setPendingAction('activate')}
            >
              <IconUserCheck className='h-4 w-4' />
              Activate account
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <UserRoleDialog
        user={user}
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onSuccess={invalidateUsers}
      />

      <AlertDialog open={pendingAction !== null} onOpenChange={(open) => !open && setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy?.title}</AlertDialogTitle>
            <AlertDialogDescription>{copy?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
