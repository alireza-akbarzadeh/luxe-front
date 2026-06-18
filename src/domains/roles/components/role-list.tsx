'use client';

import { IconPencil, IconShield, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Role } from '@/domains/roles/api/roles-api';
import { useRoleMutations } from '@/domains/roles/hooks/use-roles';
import { useRolesStore } from '@/domains/roles/stores/roles-store';
import { cn } from '@/lib/utils';

interface RoleListProps {
  roles: Role[];
  isLoading: boolean;
}

export function RoleList({ roles, isLoading }: RoleListProps) {
  const { selectedRoleId, selectRole, openEditDialog } = useRolesStore();
  const { deleteRole, isDeleting } = useRoleMutations();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedRoleId && roles.length > 0) {
      selectRole(roles[0]?.id ?? null);
    }
  }, [roles, selectedRoleId, selectRole]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRole(deleteId);
      toast.success('Role deleted');
      if (selectedRoleId === deleteId) selectRole(null);
    } catch {
      toast.error('Failed to delete role');
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className='h-20 w-full rounded-2xl' />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className='space-y-2'>
        {roles.map((role) => {
          const selected = selectedRoleId === role.id;
          return (
            <button
              key={role.id}
              type='button'
              onClick={() => selectRole(role.id)}
              className={cn(
                'border-border/60 w-full rounded-2xl border p-4 text-left transition-all',
                selected
                  ? 'border-primary/40 bg-primary/5 shadow-sm ring-1 ring-primary/20'
                  : 'bg-card/40 hover:bg-muted/30'
              )}
            >
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <IconShield className='text-primary h-4 w-4 shrink-0' />
                    <p className='text-sm font-bold'>{role.name}</p>
                    <Badge variant='secondary' className='text-[10px] uppercase'>
                      {role.slug}
                    </Badge>
                    {role.is_system ? (
                      <Badge variant='outline' className='text-[10px]'>
                        System
                      </Badge>
                    ) : null}
                  </div>
                  {role.description ? (
                    <p className='text-muted-foreground mt-1 line-clamp-2 text-xs'>{role.description}</p>
                  ) : null}
                  <p className='text-muted-foreground mt-2 text-[10px]'>
                    {role.user_count} users · {role.permission_count} permissions
                  </p>
                </div>
                <div className='flex shrink-0 gap-1'>
                  <Button
                    type='button'
                    size='icon'
                    variant='ghost'
                    className='h-8 w-8'
                    aria-label={`Edit ${role.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      openEditDialog(role.id);
                    }}
                  >
                    <IconPencil className='h-4 w-4' />
                  </Button>
                  {!role.is_system ? (
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      className='text-destructive hover:text-destructive h-8 w-8'
                      aria-label={`Delete ${role.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeleteId(role.id);
                      }}
                    >
                      <IconTrash className='h-4 w-4' />
                    </Button>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <AlertDialog open={deleteId != null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role?</AlertDialogTitle>
            <AlertDialogDescription>
              Users must be reassigned before a role with members can be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isDeleting} onClick={() => void handleDelete()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
