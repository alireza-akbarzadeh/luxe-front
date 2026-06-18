'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { menuGroupDefaults, menuGroupSchema } from '@/domains/menus/schemas/dashboard-menu.schema';
import { zodFormValidators } from '@/domains/menus/schemas/form-validator';
import { useMenuManagerStore } from '@/domains/menus/stores/menu-manager-store';
import { usePutAdminMenuGroupsId } from '@/services/-admin-menu-groups-{id}-put';
import {
  getGetAdminMenuGroupsQueryKey,
  useGetAdminMenuGroups
} from '@/services/-admin-menu-groups-get';
import { usePostAdminMenuGroups } from '@/services/-admin-menu-groups-post';

export function DashboardMenuGroupDialog() {
  const queryClient = useQueryClient();
  const { groupDialogOpen, editingGroupId, closeGroupDialog } = useMenuManagerStore();
  const { data: groupsResponse } = useGetAdminMenuGroups({
    query: { enabled: groupDialogOpen }
  });

  const editingGroup = groupsResponse?.data?.find((group) => group.id === editingGroupId);

  const { mutateAsync: createGroup, isPending: isCreating } = usePostAdminMenuGroups();
  const { mutateAsync: updateGroup, isPending: isUpdating } = usePutAdminMenuGroupsId();

  const form = useAppForm({
    defaultValues: menuGroupDefaults,
    validators: zodFormValidators(menuGroupSchema),
    onSubmit: async ({ value, formApi }) => {
      try {
        if (editingGroupId) {
          await updateGroup({
            id: editingGroupId,
            data: { name: value.name, display_order: value.display_order }
          });
          toast.success('Menu group updated');
        } else {
          await createGroup({ data: { name: value.name, display_order: value.display_order } });
          toast.success('Menu group created');
        }
        await queryClient.invalidateQueries({ queryKey: getGetAdminMenuGroupsQueryKey() });
        closeGroupDialog();
        formApi.reset();
      } catch {
        toast.error('Failed to save menu group');
      }
    }
  });

  useEffect(() => {
    if (!groupDialogOpen) return;
    if (editingGroup) {
      form.reset({
        name: editingGroup.name ?? '',
        display_order: editingGroup.display_order ?? 0
      });
    } else {
      form.reset(menuGroupDefaults);
    }
  }, [groupDialogOpen, editingGroupId, editingGroup?.id]);

  return (
    <AppDialog
      component='sheet'
      open={groupDialogOpen}
      onOpenChange={(open) => !open && closeGroupDialog()}
      title={editingGroupId ? 'Edit menu group' : 'New menu group'}
      description='Groups organize sidebar sections in the admin dashboard.'
      size='md'
    >
      <form.AppForm>
        <form.Root
          className='space-y-4 px-1'
          onSubmit={() => {
            void form.handleSubmit();
          }}
        >
          <form.AppField name='name'>
            {(field) => <field.TextField label='Group name' placeholder='e.g. Commerce' />}
          </form.AppField>
          <form.AppField name='display_order'>
            {(field) => <field.NumberField label='Display order' min={0} />}
          </form.AppField>
          <div className='flex justify-end gap-2 pt-2'>
            <Button type='button' variant='outline' onClick={closeGroupDialog}>
              Cancel
            </Button>
            <form.Submit isPending={isCreating || isUpdating}>
              {editingGroupId ? 'Save changes' : 'Create group'}
            </form.Submit>
          </div>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}
