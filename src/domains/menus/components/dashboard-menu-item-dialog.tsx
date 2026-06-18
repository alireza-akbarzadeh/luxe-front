'use client';

import { useStore } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { ICON_MAP } from '@/domains/admin/data';
import { MENU_ICON_OPTIONS } from '@/domains/menus/lib/icon-options';
import { buildGroupItemTree, flattenMenuItems } from '@/domains/menus/lib/menu-tree';
import {
  menuItemDefaults,
  menuItemSchema
} from '@/domains/menus/schemas/dashboard-menu.schema';
import { zodFormValidator } from '@/domains/menus/schemas/form-validator';
import { useMenuManagerStore } from '@/domains/menus/stores/menu-manager-store';
import { usePutAdminMenuItemsId } from '@/services/-admin-menu-items-{id}-put';
import {
  getGetAdminMenuItemsQueryKey,
  useGetAdminMenuItems
} from '@/services/-admin-menu-items-get';
import { usePostAdminMenuItems } from '@/services/-admin-menu-items-post';

export function DashboardMenuItemDialog() {
  const queryClient = useQueryClient();
  const {
    itemDialogOpen,
    editingItemId,
    createItemParentId,
    selectedGroupId,
    closeItemDialog
  } = useMenuManagerStore();

  const { data: itemsResponse } = useGetAdminMenuItems(
    { flat: true },
    { query: { enabled: itemDialogOpen } }
  );
  const flatItems = useMemo(() => itemsResponse?.data?.items ?? [], [itemsResponse?.data?.items]);

  const editingItem = flatItems.find((item) => item.id === editingItemId);

  const groupTree = useMemo(() => {
    if (!selectedGroupId) return [];
    return buildGroupItemTree(flatItems, selectedGroupId);
  }, [flatItems, selectedGroupId]);

  const parentOptions = useMemo(() => {
    const rows = flattenMenuItems(groupTree, 0, editingItemId ?? undefined);
    return [
      { label: 'Top level (no parent)', value: '' },
      ...rows.map((row) => ({
        label: `${'— '.repeat(row.depth)}${row.label}`,
        value: String(row.id)
      }))
    ];
  }, [groupTree, editingItemId]);

  const { mutateAsync: createItem, isPending: isCreating } = usePostAdminMenuItems();
  const { mutateAsync: updateItem, isPending: isUpdating } = usePutAdminMenuItemsId();

  const form = useAppForm({
    defaultValues: menuItemDefaults,
    validators: { onSubmit: zodFormValidator(menuItemSchema) },
    onSubmit: async ({ value, formApi }) => {
      if (!selectedGroupId) {
        toast.error('Select a menu group first');
        return;
      }

      const payload = {
        group_id: selectedGroupId,
        parent_id: value.parent_id ? Number(value.parent_id) : undefined,
        label: value.label,
        href: value.href?.trim() || undefined,
        icon: value.icon,
        permission: value.permission?.trim() || undefined,
        display_order: value.display_order
      };

      try {
        if (editingItemId) {
          await updateItem({ id: editingItemId, data: payload });
          toast.success('Menu item updated');
        } else {
          await createItem({ data: payload });
          toast.success('Menu item created');
        }
        await queryClient.invalidateQueries({ queryKey: getGetAdminMenuItemsQueryKey() });
        closeItemDialog();
        formApi.reset();
      } catch {
        toast.error('Failed to save menu item');
      }
    }
  });

  const iconValue = useStore(form.store, (state) => state.values.icon);
  const IconPreview = iconValue ? ICON_MAP[iconValue as keyof typeof ICON_MAP] : null;

  useEffect(() => {
    if (!itemDialogOpen || !selectedGroupId) return;

    if (editingItem) {
      form.reset({
        group_id: editingItem.group_id ?? selectedGroupId,
        parent_id: editingItem.parent_id ? String(editingItem.parent_id) : '',
        label: editingItem.label ?? '',
        href: editingItem.href ?? '',
        icon: editingItem.icon ?? 'LayoutDashboard',
        permission: editingItem.permission ?? '',
        display_order: editingItem.display_order ?? 0
      });
      return;
    }

    form.reset({
      ...menuItemDefaults,
      group_id: selectedGroupId,
      parent_id: createItemParentId ? String(createItemParentId) : ''
    });
  }, [itemDialogOpen, selectedGroupId, editingItem, createItemParentId, form]);

  return (
    <AppDialog
      component='sheet'
      open={itemDialogOpen}
      onOpenChange={(open) => !open && closeItemDialog()}
      title={editingItemId ? 'Edit menu item' : 'New menu item'}
      description='Items can nest under parents for collapsible sidebar sections.'
      size='lg'
    >
      <form.AppForm>
        <form.Root className='space-y-4 px-1'>
          <form.AppField name='label'>
            {(field) => <field.TextField label='Label' placeholder='Orders' />}
          </form.AppField>

          <form.AppField name='href'>
            {(field) => <field.TextField label='Route href' placeholder='/dashboard/orders' />}
          </form.AppField>

          <div className='grid gap-4 sm:grid-cols-2'>
            <form.AppField name='icon'>
              {(field) => (
                <field.Select label='Icon' options={MENU_ICON_OPTIONS} placeholder='Select icon' />
              )}
            </form.AppField>
            <div className='bg-muted/40 flex h-[72px] items-center justify-center rounded-xl border'>
              {IconPreview ? (
                <IconPreview className='text-primary h-8 w-8' />
              ) : (
                <span className='text-muted-foreground text-xs'>Icon preview</span>
              )}
            </div>
          </div>

          <form.AppField name='parent_id'>
            {(field) => (
              <field.Select label='Parent item' options={parentOptions} placeholder='Top level' />
            )}
          </form.AppField>

          <div className='grid gap-4 sm:grid-cols-2'>
            <form.AppField name='permission'>
              {(field) => (
                <field.TextField label='Permission scope' placeholder='orders:read (optional)' />
              )}
            </form.AppField>
            <form.AppField name='display_order'>
              {(field) => <field.NumberField label='Display order' min={0} />}
            </form.AppField>
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <Button type='button' variant='outline' onClick={closeItemDialog}>
              Cancel
            </Button>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <form.Submit disabled={isSubmitting || isCreating || isUpdating}>
                  {editingItemId ? 'Save changes' : 'Create item'}
                </form.Submit>
              )}
            </form.Subscribe>
          </div>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}
