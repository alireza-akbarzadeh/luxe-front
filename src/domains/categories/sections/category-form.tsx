'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  mapCategoryToFormValues,
  mapFormToCreateCategoryRequest,
  mapFormToUpdateCategoryRequest
} from '@/domains/categories/lib/category-mapper';
import { EntityWorkflowPanel } from '@/domains/workflows/components/entity-workflow-panel';
import { slugify } from '@/lib/utils';
import {
  getGetAdminCategoriesIdQueryKey,
  useGetAdminCategoriesId
} from '@/services/-admin-categories-{id}-get';
import { usePutAdminCategoriesId } from '@/services/-admin-categories-{id}-put';
import { usePostAdminCategories } from '@/services/-admin-categories-post';
import { getGetCategoriesQueryKey, useGetCategories } from '@/services/-categories-get';
import type { ModelsCategory } from '@/services/-categories-get.schemas';

import { categoryDefaultValues, categoryFormSchema } from '../category.schema';

interface CategoryFormProps {
  categoryId?: string;
  isEdit?: boolean;
}

export function CategoryForm({ isEdit = false, categoryId }: CategoryFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const { data: categoriesData } = useGetCategories({ limit: 100 });

  const { data: { data: { category } = {} } = {}, isLoading: isLoadingCategory } =
    useGetAdminCategoriesId(Number(categoryId), {
      query: {
        enabled: isEdit && Boolean(categoryId)
      }
    });

  const { mutateAsync: createCategory, isPending: isCreating } = usePostAdminCategories({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
      }
    }
  });

  const { mutateAsync: updateCategory, isPending: isUpdating } = usePutAdminCategoriesId({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
        if (category?.id) {
          void queryClient.invalidateQueries({
            queryKey: getGetAdminCategoriesIdQueryKey(category.id)
          });
        }
      }
    }
  });

  const isPending = isCreating || isUpdating;

  const parentOptions = useMemo(() => {
    const all: ModelsCategory[] = [];

    function flatten(nodes: ModelsCategory[] = [], depth = 0) {
      for (const node of nodes) {
        all.push({ ...node, name: `${'— '.repeat(depth)}${node.name}` });
        if (node.children?.length) flatten(node.children, depth + 1);
      }
    }

    flatten(categoriesData?.data?.categories ?? []);

    return all
      .filter((c) => c.id !== category?.id)
      .map((c) => ({ label: c.name, value: String(c.id) }));
  }, [categoriesData, category?.id]);

  const form = useAppForm({
    defaultValues: categoryDefaultValues,
    validators: {
      onChange: categoryFormSchema,
      onSubmit: categoryFormSchema
    },
    listeners: {
      onChange: ({ formApi }) => {
        const name = formApi.getFieldValue('name');
        const slugMeta = formApi.getFieldMeta('slug');
        if (!slugMeta?.isDirty && name) {
          formApi.setFieldValue('slug', slugify(name));
        }
      }
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEdit && category?.id) {
          await updateCategory({
            id: category.id,
            data: mapFormToUpdateCategoryRequest(value)
          });
          toast.success('Category updated successfully');
        } else {
          await createCategory({ data: mapFormToCreateCategoryRequest(value) });
          toast.success('Category created successfully');
        }

        push('/dashboard/categories');
      } catch (error) {
        toast.error(isEdit ? 'Failed to update category' : 'Failed to create category', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && category) {
      form.reset(mapCategoryToFormValues(category));
    }
  }, [isEdit, category, form]);

  if (isEdit && isLoadingCategory) {
    return (
      <Flex direction='column' spacing={4} className='md:p4 p-2'>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-24 w-full' />
        <Skeleton className='h-10 w-40 self-end' />
      </Flex>
    );
  }

  const editCategoryId = category?.id;

  return (
    <>
      {isEdit && editCategoryId ? (
        <EntityWorkflowPanel
          workflowKey='category'
          entityId={editCategoryId}
          className='mb-6'
          onTransitionSuccess={() => {
            void queryClient.invalidateQueries({
              queryKey: getGetAdminCategoriesIdQueryKey(editCategoryId)
            });
            void queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
          }}
        />
      ) : null}
      <form.AppForm>
        <form.Root
          className='md:p4 p-2'
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <Flex direction='column' spacing={6}>
            <Flex direction='column' spacing={4}>
              <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                <GridItem>
                  <form.AppField
                    name='name'
                    children={(field) => (
                      <field.TextField
                        label='Category name'
                        placeholder='e.g. Electronics'
                        required
                        detail='Displayed to customers in navigation and filters'
                      />
                    )}
                  />
                </GridItem>

                <GridItem>
                  <form.AppField
                    name='slug'
                    children={(field) => (
                      <field.TextField
                        label='Slug'
                        placeholder='e.g. electronics'
                        required
                        detail='Used in URLs — lowercase, hyphen-separated'
                      />
                    )}
                  />
                </GridItem>
              </Grid>

              <form.AppField
                name='description'
                children={(field) => (
                  <field.TextArea
                    label='Description'
                    placeholder='Briefly describe this category…'
                    rows={4}
                    description='Optional — shown on category landing pages'
                  />
                )}
              />
            </Flex>

            <Separator />

            <Flex direction='column' spacing={4}>
              <h3 className='text-foreground text-sm font-medium'>Organization</h3>

              <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                <GridItem>
                  <form.AppField
                    name='parent_id'
                    children={(field) => (
                      <>
                        <p className='text-muted-foreground pb-1.5 text-[10px] font-medium'>
                          Leave empty to make this a top-level category
                        </p>
                        <field.Select
                          options={parentOptions}
                          placeholder='None (top-level category)'
                          label='Parent category'
                        />
                      </>
                    )}
                  />
                </GridItem>

                <GridItem>
                  {isEdit ? (
                    <p className='text-muted-foreground text-sm'>
                      Visibility is controlled by the workflow panel above (Active / Inactive /
                      Archived).
                    </p>
                  ) : (
                    <form.AppField
                      name='is_active'
                      children={(field) => (
                        <field.Switch
                          label='Active'
                          description='Inactive categories are hidden from storefront navigation'
                        />
                      )}
                    />
                  )}
                </GridItem>
              </Grid>
            </Flex>

            <Separator />

            <Flex direction='row' justify='end' spacing={3}>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
                children={([canSubmit, isSubmitting, isDirty]) => (
                  <Button type='submit' disabled={!canSubmit || isPending || (!isDirty && isEdit)}>
                    {isPending || isSubmitting ? (
                      <>
                        <IconLoader2 className='size-4 animate-spin' />
                        {isEdit ? 'Saving…' : 'Creating…'}
                      </>
                    ) : isEdit ? (
                      'Save changes'
                    ) : (
                      'Create category'
                    )}
                  </Button>
                )}
              />
            </Flex>
          </Flex>
        </form.Root>
      </form.AppForm>
    </>
  );
}
