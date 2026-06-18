/**
 * Collection API schemas (manual until `pnpm api:gen` after swagger update).
 */
export interface DtoStateView {
  code?: string;
  color?: string;
  id?: number;
  is_final?: boolean;
  is_initial?: boolean;
  name?: string;
  sort_order?: number;
  text_color?: string;
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
  limit?: number;
  page?: number;
  total?: number;
}

export interface DtoCollectionListResponse {
  code?: number;
  data?: DtoCollectionListData;
  message?: string;
  success?: boolean;
}

export interface UtilsResponse {
  code?: number;
  error?: string;
  message?: string;
  success?: boolean;
}

export type GetCollectionsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type GetCollections200 = DtoCollectionListResponse;
