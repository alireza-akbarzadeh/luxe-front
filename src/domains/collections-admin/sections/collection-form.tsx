'use client';

import { useQueryClient } from '@tanstack/react-query';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollectionForm } from '@/domains/collections-admin/hooks/use-collection-form';
import { CollectionContentFields } from '@/domains/collections-admin/sections/collection-content-fields';
import { CollectionFormActions } from '@/domains/collections-admin/sections/collection-form-actions';
import { CollectionHeroFields } from '@/domains/collections-admin/sections/collection-hero-fields';
import { CollectionMerchandisingFields } from '@/domains/collections-admin/sections/collection-merchandising-fields';
import { CollectionModeFields } from '@/domains/collections-admin/sections/collection-mode-fields';
import { CollectionPresentationFields } from '@/domains/collections-admin/sections/collection-presentation-fields';
import { CollectionScheduleFields } from '@/domains/collections-admin/sections/collection-schedule-fields';
import { CollectionSeoFields } from '@/domains/collections-admin/sections/collection-seo-fields';
import type { CollectionFormProps } from '@/domains/collections-admin/types/collections-admin.types';
import { EntityWorkflowPanel } from '@/domains/workflows/components/entity-workflow-panel';
import { getGetCollectionsIdQueryKey } from '@/services/-collections-{id}-get';
import { getGetCollectionsQueryKey } from '@/services/-collections-get';

export function CollectionForm({ isEdit = false, collectionId }: CollectionFormProps) {
  const queryClient = useQueryClient();
  const {
    form,
    collection,
    isLoadingCollection,
    isPending,
    isUploadingImage,
    fileInputRef,
    handleImageUpload,
    effectiveProductOverrides,
    setProductOverrides,
    push
  } = useCollectionForm({ isEdit, collectionId });

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

  const editCollectionId = isEdit ? collection?.id : undefined;

  return (
    <>
      {editCollectionId ? (
        <EntityWorkflowPanel
          workflowKey='collection'
          entityId={editCollectionId}
          className='mb-6'
          onTransitionSuccess={() => {
            void queryClient.invalidateQueries({
              queryKey: getGetCollectionsIdQueryKey(editCollectionId)
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
                <CollectionContentFields form={form} isEdit={isEdit} />
                <Separator />
                <CollectionPresentationFields
                  form={form}
                  isUploadingImage={isUploadingImage}
                  fileInputRef={fileInputRef}
                  onImageUpload={handleImageUpload}
                />
                <Separator />
                <CollectionModeFields form={form} />
                <Separator />
                <CollectionScheduleFields form={form} />
                <Separator />
                <CollectionMerchandisingFields
                  form={form}
                  collectionId={collection?.id}
                  productOverrides={effectiveProductOverrides}
                  onProductOverridesChange={setProductOverrides}
                />
                <Separator />
                <CollectionSeoFields form={form} />
                <Separator />
                <CollectionHeroFields form={form} />
                <CollectionFormActions
                  form={form}
                  isEdit={isEdit}
                  isPending={isPending}
                  onCancel={() => push('/dashboard/collections')}
                />
              </Flex>
            </form.Root>
          </form.AppForm>
        </CardContent>
      </Card>
    </>
  );
}
