'use client';

import { IconLoader2, IconPhoto } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/typography';
import {
  mapCategoryToFormValues,
  mapFormToCreateCategoryRequest,
  mapFormToUpdateCategoryRequest
} from '@/domains/categories/lib/category-mapper';
import { sortCategoriesByOrder } from '@/domains/categories/lib/category-tree';
import { uploadCategoryImage } from '@/domains/categories/lib/upload-category-image';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

    return sortCategoriesByOrder(all)
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

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadCategoryImage(file);
      form.setFieldValue('image_url', publicUrl);
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

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
              <Text variant='small' className='font-medium'>
                Appearance
              </Text>

              <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                <GridItem>
                  <form.AppField
                    name='icon'
                    children={(field) => (
                      <field.TextField
                        label='Icon name'
                        placeholder='e.g. IconShirt'
                        detail='Optional Tabler icon name shown in navigation'
                      />
                    )}
                  />
                </GridItem>
              </Grid>

              <form.Subscribe
                selector={(state) => state.values.image_url}
                children={(imageUrl) => (
                  <Flex direction='row' spacing={4} align='start' className='flex-wrap'>
                    <Flex
                      align='center'
                      justify='center'
                      className='bg-muted relative h-28 w-28 overflow-hidden rounded-xl border'
                    >
                      {imageUrl ? (
                        <AppImage
                          src={imageUrl}
                          alt='Category image preview'
                          fill
                          sizes='112px'
                          className='object-cover'
                        />
                      ) : (
                        <IconPhoto className='text-muted-foreground size-8' />
                      )}
                    </Flex>

                    <Flex direction='column' spacing={3} className='min-w-60 flex-1'>
                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/jpeg,image/png,image/webp,image/gif'
                        className='hidden'
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void handleImageUpload(file);
                          event.target.value = '';
                        }}
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='w-fit'
                        disabled={isUploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {isUploadingImage ? (
                          <>
                            <IconLoader2 className='size-4 animate-spin' />
                            Uploading…
                          </>
                        ) : (
                          'Upload featured image'
                        )}
                      </Button>
                      <form.AppField
                        name='image_url'
                        children={(field) => (
                          <field.TextField
                            label='Image URL'
                            placeholder='https://…'
                            detail='Or paste a CDN URL directly'
                          />
                        )}
                      />
                    </Flex>
                  </Flex>
                )}
              />
            </Flex>

            <Separator />

            <Flex direction='column' spacing={4}>
              <Text variant='small' className='font-medium'>
                SEO
              </Text>

              <form.AppField
                name='meta_title'
                children={(field) => (
                  <field.TextField
                    label='Meta title'
                    placeholder='Category title for search engines'
                    detail={`${(field.state.value ?? '').length}/70 characters`}
                  />
                )}
              />

              <form.AppField
                name='meta_description'
                children={(field) => (
                  <field.TextArea
                    label='Meta description'
                    placeholder='Short summary for search results'
                    rows={3}
                    description={`${(field.state.value ?? '').length}/160 characters`}
                  />
                )}
              />
            </Flex>

            <Separator />

            <Flex direction='column' spacing={4}>
              <Text variant='small' className='font-medium'>
                Organization
              </Text>

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
