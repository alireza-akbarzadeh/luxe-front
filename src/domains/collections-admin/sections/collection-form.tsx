'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  COLLECTION_CATEGORY_NONE,
  COLLECTION_PREVIEW_SORT_OPTIONS,
  COLLECTION_STATUS_OPTIONS,
  collectionDefaultValues,
  collectionFormSchema
} from '@/domains/collections-admin/collection.schema';
import {
  mapCollectionToFormValues,
  mapFormToCreateCollectionRequest,
  mapFormToUpdateCollectionRequest
} from '@/domains/collections-admin/lib/collection-mapper';
import { EntityWorkflowPanel } from '@/domains/workflows/components/entity-workflow-panel';
import { slugify } from '@/lib/utils';
import { useGetCategories } from '@/services/-categories-get';
import type { ModelsCategory } from '@/services/-categories-get.schemas';
import { useGetCollectionsId } from '@/services/-collections-{id}-get';
import { getGetCollectionsIdQueryKey } from '@/services/-collections-{id}-get';
import { usePutCollectionsId } from '@/services/-collections-{id}-put';
import { getGetCollectionsQueryKey } from '@/services/-collections-get';
import { usePostCollections } from '@/services/-collections-post';

interface CollectionFormProps {
  collectionId?: string;
  isEdit?: boolean;
}

export function CollectionForm({ isEdit = false, collectionId }: CollectionFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const { data: categoriesData } = useGetCategories({ limit: 100 });

  const {
    data: { data: collection } = {},
    isLoading: isLoadingCollection
  } = useGetCollectionsId(Number(collectionId), {
    query: { enabled: isEdit && Boolean(collectionId) }
  });

  const { mutateAsync: createCollection, isPending: isCreating } = usePostCollections({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetCollectionsQueryKey() });
      }
    }
  });

  const { mutateAsync: updateCollection, isPending: isUpdating } = usePutCollectionsId({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetCollectionsQueryKey() });
        if (collection?.id) {
          void queryClient.invalidateQueries({
            queryKey: getGetCollectionsIdQueryKey(collection.id)
          });
        }
      }
    }
  });

  const isPending = isCreating || isUpdating;

  const categoryOptions = useMemo(() => {
    const options: { label: string; value: string }[] = [];

    function flatten(nodes: ModelsCategory[] = [], depth = 0) {
      for (const node of nodes) {
        options.push({
          label: `${'— '.repeat(depth)}${node.name}`,
          value: String(node.id)
        });
        if (node.children?.length) flatten(node.children, depth + 1);
      }
    }

    flatten(categoriesData?.data?.categories ?? []);
    return [{ label: 'All categories', value: COLLECTION_CATEGORY_NONE }, ...options];
  }, [categoriesData]);

  const form = useAppForm({
    defaultValues: collectionDefaultValues,
    validators: {
      onChange: collectionFormSchema,
      onSubmit: collectionFormSchema
    },
    listeners: {
      onChange: ({ formApi }) => {
        const title = formApi.getFieldValue('title');
        const slugMeta = formApi.getFieldMeta('slug');
        if (!slugMeta?.isDirty && title) {
          formApi.setFieldValue('slug', slugify(title));
        }
      }
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEdit && collection?.id) {
          await updateCollection({
            id: collection.id,
            data: mapFormToUpdateCollectionRequest(value)
          });
          toast.success('Collection updated successfully');
        } else {
          await createCollection({ data: mapFormToCreateCollectionRequest(value) });
          toast.success('Collection created successfully');
        }

        push('/dashboard/collections');
      } catch (error) {
        toast.error(isEdit ? 'Failed to update collection' : 'Failed to create collection', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && collection) {
      form.reset(mapCollectionToFormValues(collection));
    }
  }, [isEdit, collection, form]);

  if (isEdit && isLoadingCollection) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-72' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-24 w-full' />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {isEdit && collection?.id ? (
        <EntityWorkflowPanel
          workflowKey='collection'
          entityId={collection.id}
          className='mb-6'
          onTransitionSuccess={() => {
            void queryClient.invalidateQueries({
              queryKey: getGetCollectionsIdQueryKey(collection.id)
            });
            void queryClient.invalidateQueries({ queryKey: getGetCollectionsQueryKey() });
          }}
        />
      ) : null}
    <Card className='border-border/40 bg-card/40 backdrop-blur-2xl'>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit collection' : 'Create collection'}</CardTitle>
        <CardDescription>
          {isEdit
            ? 'Update curated collection cards shown on the storefront collections page.'
            : 'Create a new curated collection for the storefront.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form.AppForm>
          <form.Root
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <Flex direction='column' spacing={6}>
              <Flex direction='column' spacing={4}>
                <h3 className='text-foreground text-sm font-medium'>Content</h3>
                <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                  <GridItem>
                    <form.AppField
                      name='eyebrow'
                      children={(field) => (
                        <field.TextField
                          label='Eyebrow'
                          placeholder='e.g. Spring edit'
                          detail='Small label above the title'
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='sort_order'
                      children={(field) => (
                        <field.TextField
                          label='Sort order'
                          type='number'
                          detail='Lower numbers appear first'
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem className='sm:col-span-2'>
                    <form.AppField
                      name='title'
                      children={(field) => (
                        <field.TextField label='Title' placeholder='Modern Essentials' required />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='slug'
                      children={(field) => (
                        <field.TextField
                          label='Slug'
                          placeholder='modern-essentials'
                          required
                          detail='Used as anchor id on the collections page'
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    {isEdit ? (
                      <p className='text-muted-foreground text-sm'>
                        Status is controlled by the workflow panel above (Draft / Active / Inactive /
                        Archived).
                      </p>
                    ) : (
                      <form.AppField
                        name='status'
                        children={(field) => (
                          <field.Select
                            label='Status'
                            options={[...COLLECTION_STATUS_OPTIONS]}
                            required
                          />
                        )}
                      />
                    )}
                  </GridItem>
                </Grid>

                <form.AppField
                  name='description'
                  children={(field) => (
                    <field.TextArea label='Description' rows={4} placeholder='Short summary…' />
                  )}
                />
              </Flex>

              <Separator />

              <Flex direction='column' spacing={4}>
                <h3 className='text-foreground text-sm font-medium'>Presentation</h3>
                <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                  <GridItem>
                    <form.AppField
                      name='href'
                      children={(field) => (
                        <field.TextField
                          label='Shop link'
                          placeholder='/shop?sortBy=newest'
                          detail='Where the CTA button navigates'
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='cta_label'
                      children={(field) => (
                        <field.TextField label='CTA label' placeholder='Shop collection' />
                      )}
                    />
                  </GridItem>
                  <GridItem className='sm:col-span-2'>
                    <form.AppField
                      name='image_url'
                      children={(field) => (
                        <field.TextField
                          label='Hero image URL'
                          placeholder='https://…'
                          detail='Cover image for cards and hero grid'
                        />
                      )}
                    />
                  </GridItem>
                </Grid>
              </Flex>

              <Separator />

              <Flex direction='column' spacing={4}>
                <h3 className='text-foreground text-sm font-medium'>Product preview</h3>
                <p className='text-muted-foreground text-sm'>
                  Optional filters for the product row shown under each collection on the storefront.
                </p>
                <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                  <GridItem>
                    <form.AppField
                      name='preview_sort'
                      children={(field) => (
                        <field.Select
                          label='Preview sort'
                          options={[...COLLECTION_PREVIEW_SORT_OPTIONS]}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='preview_category_id'
                      children={(field) => (
                        <field.Select
                          label='Preview category'
                          options={categoryOptions}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='preview_is_new'
                      children={(field) => (
                        <field.Switch label='New products only' description='Filter preview to new items' />
                      )}
                    />
                  </GridItem>
                </Grid>
              </Flex>

              <Separator />

              <Flex direction='row' justify='between' spacing={3} className='flex-wrap'>
                <Button type='button' variant='ghost' onClick={() => push('/dashboard/collections')}>
                  Cancel
                </Button>

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
                  children={([canSubmit, isSubmitting, isDirty]) => (
                    <Button
                      type='submit'
                      disabled={!canSubmit || isPending || (!isDirty && isEdit)}
                    >
                      {isPending || isSubmitting ? (
                        <>
                          <IconLoader2 className='size-4 animate-spin' />
                          {isEdit ? 'Saving…' : 'Creating…'}
                        </>
                      ) : isEdit ? (
                        'Save changes'
                      ) : (
                        'Create collection'
                      )}
                    </Button>
                  )}
                />
              </Flex>
            </Flex>
          </form.Root>
        </form.AppForm>
      </CardContent>
    </Card>
    </>
  );
}
