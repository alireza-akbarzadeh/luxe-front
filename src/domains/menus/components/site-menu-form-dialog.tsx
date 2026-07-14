'use client';

import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toSiteMenuFormValues } from '@/domains/menus/lib/nav-menu-payload';
import { zodFormValidators } from '@/domains/menus/schemas/form-validator';
import {
  siteMenuDefaults,
  type SiteMenuFormValues,
  siteMenuSchema
} from '@/domains/menus/schemas/site-menu.schema';
import { useSiteMenuManagerStore } from '@/domains/menus/stores/menu-manager-store';
import { useGetNavMenusId } from '@/services/-nav-menus-{id}-get';
import { usePutNavMenusId } from '@/services/-nav-menus-{id}-put';
import { getGetNavMenusQueryKey } from '@/services/-nav-menus-get';
import { usePostNavMenus } from '@/services/-nav-menus-post';
import { DtoUpsertNavMenuRequestType } from '@/services/-nav-menus-post.schemas';

function toApiPayload(value: SiteMenuFormValues) {
  return {
    label: value.label,
    type:
      value.type === 'mega' ? DtoUpsertNavMenuRequestType.mega : DtoUpsertNavMenuRequestType.link,
    href: value.type === 'link' ? value.href?.trim() || undefined : undefined,
    badge: value.badge?.trim() || undefined,
    order: value.order,
    viewAll:
      value.type === 'mega' && value.viewAllLabel && value.viewAllHref
        ? { label: value.viewAllLabel, href: value.viewAllHref }
        : undefined,
    columns: value.type === 'mega' ? value.columns : undefined,
    featured: value.type === 'mega' ? value.featured : undefined
  };
}

export function SiteMenuFormDialog({ itemCount = 0 }: { itemCount?: number }) {
  const queryClient = useQueryClient();
  const { dialogOpen, editingNavId, editingNavItem, closeDialog } = useSiteMenuManagerStore();

  const { data: navResponse, isLoading: isLoadingNav } = useGetNavMenusId(editingNavId ?? 0, {
    query: { enabled: dialogOpen && editingNavId != null }
  });

  const { mutateAsync: createNav, isPending: isCreating } = usePostNavMenus();
  const { mutateAsync: updateNav, isPending: isUpdating } = usePutNavMenusId();

  const form = useAppForm({
    defaultValues: siteMenuDefaults,
    validators: zodFormValidators(siteMenuSchema),
    onSubmit: async ({ value, formApi }) => {
      const payload = toApiPayload(value);
      try {
        if (editingNavId) {
          await updateNav({ id: editingNavId, data: payload });
          toast.success('Navigation item updated');
        } else {
          await createNav({ data: payload });
          toast.success('Navigation item created');
        }
        await queryClient.invalidateQueries({ queryKey: getGetNavMenusQueryKey() });
        closeDialog();
        formApi.reset();
      } catch {
        toast.error('Failed to save navigation item');
      }
    }
  });

  const menuType = useStore(form.store, (state) => state.values.type);
  const columns = useStore(form.store, (state) => state.values.columns);
  const featured = useStore(form.store, (state) => state.values.featured);

  useEffect(() => {
    if (!dialogOpen) return;

    if (!editingNavId) {
      form.reset({
        ...siteMenuDefaults,
        order: itemCount + 1
      });
      return;
    }

    const source = navResponse?.data
      ? { ...editingNavItem, ...navResponse.data, id: editingNavId }
      : editingNavItem;

    if (!source) return;

    const order =
      editingNavItem?.order && editingNavItem.order > 0
        ? editingNavItem.order
        : (source.order ?? 0);

    form.reset(toSiteMenuFormValues(source, order));
  }, [dialogOpen, editingNavId, editingNavItem, navResponse?.data, itemCount]);

  const isHydratingEdit = Boolean(editingNavId && !editingNavItem && isLoadingNav);

  const addColumn = () => {
    form.setFieldValue('columns', [...columns, { title: 'New column', links: [] }]);
  };

  const removeColumn = (index: number) => {
    form.setFieldValue(
      'columns',
      columns.filter((_, columnIndex) => columnIndex !== index)
    );
  };

  const addLink = (columnIndex: number) => {
    const next = [...columns];
    const current = next[columnIndex] ?? { title: 'New column', links: [] };
    next[columnIndex] = {
      title: current.title ?? 'New column',
      links: [...(current.links ?? []), { title: 'Link', href: '/' }]
    };
    form.setFieldValue('columns', next);
  };

  const addFeatured = () => {
    form.setFieldValue('featured', [
      ...featured,
      { title: 'Featured', description: '', href: '/', image: '', badge: '' }
    ]);
  };

  return (
    <AppDialog
      open={dialogOpen}
      onOpenChange={(open) => !open && closeDialog()}
      title={editingNavId ? 'Edit navigation item' : 'New navigation item'}
      description='Top-level storefront nav item. Mega menus hold columns and links inside the dropdown — not separate parent/child rows.'
      size='xl'
      preferDialog
      className='bg-popover text-popover-foreground border-border ring-1 ring-white/10'
    >
      {isHydratingEdit ? (
        <div className='space-y-4 px-1 pb-6'>
          <Skeleton className='h-10 w-full rounded-xl' />
          <Skeleton className='h-10 w-full rounded-xl' />
          <Skeleton className='h-32 w-full rounded-xl' />
        </div>
      ) : (
        <form.AppForm>
          <form.Root
            className='space-y-5 px-1 pb-6'
            onSubmit={() => {
              void form.handleSubmit();
            }}
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <form.AppField name='label'>
                {(field) => <field.TextField label='Label' placeholder='Shop' />}
              </form.AppField>
              <form.AppField name='type'>
                {(field) => (
                  <field.Select
                    label='Type'
                    options={[
                      { label: 'Simple link', value: 'link' },
                      { label: 'Mega menu', value: 'mega' }
                    ]}
                  />
                )}
              </form.AppField>
            </div>

            {menuType === 'link' ? (
              <form.AppField name='href'>
                {(field) => <field.TextField label='Href' placeholder='/shop' />}
              </form.AppField>
            ) : null}

            <div className='grid gap-4 sm:grid-cols-2'>
              <form.AppField name='badge'>
                {(field) => <field.TextField label='Badge (optional)' placeholder='New' />}
              </form.AppField>
              <form.AppField name='order'>
                {(field) => <field.NumberField label='Display order' min={0} />}
              </form.AppField>
            </div>

            {menuType === 'mega' ? (
              <>
                <Separator />
                <div className='grid gap-4 sm:grid-cols-2'>
                  <form.AppField name='viewAllLabel'>
                    {(field) => <field.TextField label='View all label' placeholder='View all' />}
                  </form.AppField>
                  <form.AppField name='viewAllHref'>
                    {(field) => <field.TextField label='View all href' placeholder='/shop' />}
                  </form.AppField>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-bold'>Columns</p>
                    <Button
                      type='button'
                      size='sm'
                      variant='outline'
                      className='h-8 gap-1'
                      onClick={addColumn}
                    >
                      <IconPlus className='h-3.5 w-3.5' /> Add column
                    </Button>
                  </div>
                  {columns.map((column, columnIndex) => (
                    <div
                      key={`column-${columnIndex}`}
                      className='border-border/60 rounded-xl border p-3'
                    >
                      <div className='mb-2 flex items-center justify-between gap-2'>
                        <form.AppField name={`columns[${columnIndex}].title`}>
                          {(field) => <field.TextField label={`Column ${columnIndex + 1} title`} />}
                        </form.AppField>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='text-destructive mt-6 h-8 w-8'
                          onClick={() => removeColumn(columnIndex)}
                        >
                          <IconTrash className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='space-y-2 pl-1'>
                        {(column.links ?? []).map((_, linkIndex) => (
                          <div
                            key={`link-${columnIndex}-${linkIndex}`}
                            className='grid gap-2 sm:grid-cols-2'
                          >
                            <form.AppField
                              name={`columns[${columnIndex}].links[${linkIndex}].title`}
                            >
                              {(field) => <field.TextField label='Link title' />}
                            </form.AppField>
                            <form.AppField
                              name={`columns[${columnIndex}].links[${linkIndex}].href`}
                            >
                              {(field) => <field.TextField label='Link href' />}
                            </form.AppField>
                          </div>
                        ))}
                        <Button
                          type='button'
                          size='sm'
                          variant='outline'
                          className='h-8 text-xs'
                          onClick={() => addLink(columnIndex)}
                        >
                          Add link
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-bold'>Featured cards</p>
                    <Button
                      type='button'
                      size='sm'
                      variant='outline'
                      className='h-8 gap-1'
                      onClick={addFeatured}
                    >
                      <IconPlus className='h-3.5 w-3.5' /> Add featured
                    </Button>
                  </div>
                  {featured.map((_, featuredIndex) => (
                    <div
                      key={`featured-${featuredIndex}`}
                      className='border-border/60 grid gap-3 rounded-xl border p-3 sm:grid-cols-2'
                    >
                      <form.AppField name={`featured[${featuredIndex}].title`}>
                        {(field) => <field.TextField label='Title' />}
                      </form.AppField>
                      <form.AppField name={`featured[${featuredIndex}].href`}>
                        {(field) => <field.TextField label='Href' />}
                      </form.AppField>
                      <form.AppField name={`featured[${featuredIndex}].description`}>
                        {(field) => <field.TextField label='Description' />}
                      </form.AppField>
                      <form.AppField name={`featured[${featuredIndex}].image`}>
                        {(field) => <field.TextField label='Image URL' />}
                      </form.AppField>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            <div className='border-border/60 bg-card/40 sticky bottom-0 -mx-1 flex justify-end gap-2 border-t px-1 pt-4 pb-1'>
              <Button
                className='flex-1'
                size='lg'
                type='button'
                variant='secondary'
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <form.Submit className='flex-1' isPending={isCreating || isUpdating}>
                {editingNavId ? 'Save changes' : 'Create item'}
              </form.Submit>
            </div>
          </form.Root>
        </form.AppForm>
      )}
    </AppDialog>
  );
}
