import type { RefObject } from 'react';

import type { CollectionFormValues } from '@/domains/collections-admin/collection.schema';
import type { DtoCollectionProductOverrideInput } from '@/services/-collections-get.schemas';

/** Props for the admin collection create/edit form shell. */
export interface CollectionFormProps {
  collectionId?: string;
  isEdit?: boolean;
}

/** Props passed into presentation section for hero image upload. */
export interface CollectionPresentationUploadProps {
  isUploadingImage: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageUpload: (file: File) => Promise<void>;
}

/** Shared props for merchandising section (manual/hybrid product overrides). */
export interface CollectionMerchandisingFieldsProps {
  collectionId?: number;
  productOverrides: DtoCollectionProductOverrideInput[];
  onProductOverridesChange: (next: DtoCollectionProductOverrideInput[]) => void;
}

export type { CollectionFormValues };
