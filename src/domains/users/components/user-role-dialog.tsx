'use client';

import { IconShield } from '@tabler/icons-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { zodFormValidators } from '@/domains/menus/schemas/form-validator';
import { useRoleSelectOptions } from '@/domains/users/hooks/use-role-options';
import {
  assignUserRoleSchema,
  type AssignUserRoleValues
} from '@/domains/users/schemas/user-role.schema';
import { usePatchAdminUsersIdRole } from '@/services/-admin-users-{id}-role-patch';
import type { DtoAdminUserResponse } from '@/services/-admin-users-get.schemas';

interface UserRoleDialogProps {
  user: DtoAdminUserResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UserRoleDialog({ user, open, onOpenChange, onSuccess }: UserRoleDialogProps) {
  const { options, isLoading: isRolesLoading } = useRoleSelectOptions();

  const roleMutation = usePatchAdminUsersIdRole({
    mutation: {
      onSuccess: () => {
        toast.success('User role updated');
        onOpenChange(false);
        onSuccess?.();
      },
      onError: () => {
        toast.error('Failed to update user role');
      }
    }
  });

  const form = useAppForm({
    defaultValues: { role: '' } satisfies AssignUserRoleValues,
    validators: zodFormValidators(assignUserRoleSchema),
    onSubmit: async ({ value }) => {
      if (!user?.id) return;
      await roleMutation.mutateAsync({
        id: user.id,
        data: { role: value.role }
      });
    }
  });

  useEffect(() => {
    if (!open || !user) return;
    form.reset({ role: user.role ?? 'user' });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when dialog opens for user
  }, [open, user?.id, user?.role]);

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'User';

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Assign role'
      description={`Choose the access role for ${displayName}.`}
      size='sm'
    >
      <form.AppForm>
        <form.Root
          className='space-y-4 px-1 pb-2'
          onSubmit={() => {
            void form.handleSubmit();
          }}
        >
          <form.AppField name='role'>
            {(field) => (
              <field.Select
                label='Role'
                placeholder={isRolesLoading ? 'Loading roles…' : 'Select a role'}
                options={options}
                disabled={isRolesLoading || options.length === 0}
              />
            )}
          </form.AppField>

          {options.length === 0 && !isRolesLoading ? (
            <p className='text-muted-foreground text-xs'>
              No roles found. Create roles under Dashboard → Roles, or run{' '}
              <code className='text-xs'>make seed-dev</code> in the backend.
            </p>
          ) : null}

          <div className='flex justify-end gap-2 pt-2'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <form.Submit
              isPending={roleMutation.isPending}
              className='h-10 w-auto flex-none px-6'
            >
              <IconShield className='mr-2 h-4 w-4' />
              Save role
            </form.Submit>
          </div>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}
