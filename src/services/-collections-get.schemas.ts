import type { DtoStateView } from './-workflows-{key}-get.schemas';

export interface UtilsResponse {
  code?: number;
  error?: string;
  message?: string;
  success?: boolean;
}

export interface DtoCollectionResponse {
  id?: number;
  slug?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  image_url?: string;
  cta_label?: string;
  sort_order?: number;
  status?: string;
  workflow_state?: DtoStateView;
  preview_sort?: string;
  preview_is_new?: boolean;
  preview_category_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DtoCollectionListData {
  collections?: DtoCollectionResponse[];
  total?: number;
  page?: number;
  limit?: number;
}

export type GetCollections200 = UtilsResponse & {
  data?: DtoCollectionListData;
};

export type GetCollectionsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export interface DtoCreateCollectionRequest {
  slug: string;
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  image_url?: string;
  cta_label?: string;
  sort_order?: number;
  status?: string;
  preview_sort?: string;
  preview_is_new?: boolean;
  preview_category_id?: number;
}

export interface DtoUpdateCollectionRequest {
  slug?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  image_url?: string;
  cta_label?: string;
  sort_order?: number;
  status?: string;
  preview_sort?: string;
  preview_is_new?: boolean;
  preview_category_id?: number;
}

export type GetCollectionsId200 = UtilsResponse & {
  data?: DtoCollectionResponse;
};

export type PostCollections201 = UtilsResponse & {
  data?: DtoCollectionResponse;
};

export type PutCollectionsId200 = UtilsResponse & {
  data?: DtoCollectionResponse;
};
