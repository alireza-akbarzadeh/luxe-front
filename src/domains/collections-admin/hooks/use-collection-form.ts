'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import {
  collectionDefaultValues,
  collectionFormSchema
} from '@/domains/collections-admin/collection.schema';
import {
  mapCollectionToFormValues,
  mapFormToCreateCollectionRequest,
  mapFormToUpdateCollectionRequest
} from '@/domains/collections-admin/lib/collection-mapper';
import { uploadCollectionImage } from '@/domains/collections-admin/lib/upload-collection-image';
import { slugify } from '@/lib/utils';
import { useGetCollectionsId } from '@/services/-collections-{id}-get';
import { getGetCollectionsIdQueryKey } from '@/services/-collections-{id}-get';
import { usePutCollectionsId } from '@/services/-collections-{id}-put';
import { getGetCollectionsQueryKey } from '@/services/-collections-get';
import type { DtoCollectionProductOverrideInput } from '@/services/-collections-get.schemas';
import { usePostCollections } from '@/services/-collections-post';

/** Owns collection form mutations, image upload, and edit hydration. */
export function useCollectionForm({
  isEdit = false,
  collectionId
}: {
  isEdit?: boolean;
  collectionId?: string;
}) {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [productOverrides, setProductOverrides] = useState<DtoCollectionProductOverrideInput[]>([]);

  const { data: { data: collection } = {}, isLoading: isLoadingCollection } = useGetCollectionsId(
    Number(collectionId),
    { query: { enabled: isEdit && Boolean(collectionId) } }
  );

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

  const isPending = isCreating || isUpdating || isUploadingImage;
  const effectiveProductOverrides = useMemo(
    () => (productOverrides.length > 0 ? productOverrides : (collection?.product_overrides ?? [])),
    [collection?.product_overrides, productOverrides]
  );

  const form = useAppForm({
    defaultValues: collectionDefaultValues,
    validators: { onChange: collectionFormSchema, onSubmit: collectionFormSchema },
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
            data: mapFormToUpdateCollectionRequest(value, effectiveProductOverrides)
          });
          toast.success('Collection updated successfully');
        } else {
          await createCollection({
            data: mapFormToCreateCollectionRequest(value, effectiveProductOverrides)
          });
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

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadCollectionImage(file);
      form.setFieldValue('image_url', publicUrl);
      form.setFieldValue('desktop_image_url', publicUrl);
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  return {
    form,
    collection,
    isLoadingCollection,
    isPending,
    isUploadingImage,
    fileInputRef,
    handleImageUpload,
    effectiveProductOverrides,
    setProductOverrides,
    queryClient,
    push
  };
}
