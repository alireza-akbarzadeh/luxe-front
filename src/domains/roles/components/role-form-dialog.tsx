'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { zodFormValidators } from '@/domains/menus/schemas/form-validator';
import { useRole, useRoleMutations } from '@/domains/roles/hooks/use-roles';
import {
  roleDefaults,
  roleEditDefaults,
  roleEditSchema,
  roleSchema,
  slugifyRoleName
} from '@/domains/roles/schemas/role.schema';
import { useRolesStore } from '@/domains/roles/stores/roles-store';

export function RoleFormDialog() {
  const { createDialogOpen, editRoleId, closeDialogs } = useRolesStore();
  const { data: editingRole } = useRole(editRoleId);
  const { createRole, updateRole, isCreating, isUpdating } = useRoleMutations();

  const isEdit = editRoleId != null;
  const open = createDialogOpen || isEdit;

  const createForm = useAppForm({
    defaultValues: roleDefaults,
    validators: zodFormValidators(roleSchema),
    listeners: {
      onChange: ({ formApi, fieldApi }) => {
        if (fieldApi?.name !== 'name') return;
        const slugMeta = formApi.getFieldMeta('slug');
        if (slugMeta?.isDirty) return;
        const slug = slugifyRoleName(formApi.getFieldValue('name'));
        if (slug) formApi.setFieldValue('slug', slug);
      }
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await createRole({
          name: value.name,
          slug: value.slug,
          description: value.description?.trim() || undefined
        });
        toast.success('Role created');
        closeDialogs();
        formApi.reset();
      } catch {
        toast.error('Failed to create role');
      }
    }
  });

  const editForm = useAppForm({
    defaultValues: roleEditDefaults,
    validators: zodFormValidators(roleEditSchema),
    onSubmit: async ({ value, formApi }) => {
      if (!editRoleId) return;
      try {
        await updateRole({
          id: editRoleId,
          data: {
            name: value.name,
            description: value.description?.trim() || undefined
          }
        });
        toast.success('Role updated');
        closeDialogs();
        formApi.reset();
      } catch {
        toast.error('Failed to update role');
      }
    }
  });

  useEffect(() => {
    if (!createDialogOpen) return;
    createForm.reset(roleDefaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when dialog opens
  }, [createDialogOpen]);

  useEffect(() => {
    if (!isEdit || !editingRole) return;
    editForm.reset({
      name: editingRole.name,
      description: editingRole.description ?? ''
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when editing role loads
  }, [isEdit, editingRole?.id]);

  return (
    <AppDialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && closeDialogs()}
      title={isEdit ? 'Edit role' : 'New role'}
      description={
        isEdit
          ? 'Update the display name and description. Slug is fixed after creation.'
          : 'Create a custom role. Assign permissions after saving.'
      }
      size='md'
    >
      {isEdit ? (
        <editForm.AppForm>
          <editForm.Root
            className='space-y-4 px-1 pb-2'
            onSubmit={() => {
              void editForm.handleSubmit();
            }}
          >
            <editForm.AppField name='name'>
              {(field) => <field.TextField label='Role name' />}
            </editForm.AppField>
            <editForm.AppField name='description'>
              {(field) => <field.TextArea label='Description (optional)' />}
            </editForm.AppField>
            <div className='flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={closeDialogs}>
                Cancel
              </Button>
              <editForm.Submit isPending={isUpdating}>Save changes</editForm.Submit>
            </div>
          </editForm.Root>
        </editForm.AppForm>
      ) : (
        <createForm.AppForm>
          <createForm.Root
            className='space-y-4 px-1 pb-2'
            onSubmit={() => {
              void createForm.handleSubmit();
            }}
          >
            <createForm.AppField name='name'>
              {(field) => <field.TextField label='Role name' placeholder='Content manager' />}
            </createForm.AppField>
            <createForm.AppField name='slug'>
              {(field) => <field.TextField label='Slug' placeholder='content-manager' />}
            </createForm.AppField>
            <createForm.AppField name='description'>
              {(field) => (
                <field.TextArea label='Description (optional)' placeholder='What this role can do' />
              )}
            </createForm.AppField>
            <div className='flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={closeDialogs}>
                Cancel
              </Button>
              <createForm.Submit isPending={isCreating}>Create role</createForm.Submit>
            </div>
          </createForm.Root>
        </createForm.AppForm>
      )}
    </AppDialog>
  );
}
