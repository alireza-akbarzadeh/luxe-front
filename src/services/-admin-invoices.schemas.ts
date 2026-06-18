export type { UtilsResponse, GetAdminInvoicesParams } from './-admin-invoices-get.schemas';

import type { UtilsResponse } from './-admin-invoices-get.schemas';

export interface DtoAdminInvoiceListItem {
  id?: number;
  invoice_number?: string;
  order_id?: number;
  order_number?: string;
  user_id?: number;
  customer_name?: string;
  customer_email?: string;
  total_amount?: number;
  currency?: string;
  status?: string;
  issued_at?: string;
  paid_at?: string;
  created_at?: string;
}

export interface DtoAdminInvoiceListData {
  limit?: number;
  offset?: number;
  invoices?: DtoAdminInvoiceListItem[];
  total?: number;
}

export type GetAdminInvoices200 = UtilsResponse & {
  data?: DtoAdminInvoiceListData;
};

export interface DtoAdminOrderItemView {
  id?: number;
  product_id?: number;
  name?: string;
  sku?: string;
  image?: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  category?: string;
}

export interface DtoInvoiceDetailResponse {
  id?: number;
  invoice_number?: string;
  order_id?: number;
  order_number?: string;
  user_id?: number;
  status?: string;
  subtotal?: number;
  tax_amount?: number;
  shipping_amount?: number;
  total_amount?: number;
  currency?: string;
  billing_name?: string;
  billing_email?: string;
  notes?: string;
  payment_status?: string;
  payment_method?: string;
  issued_at?: string;
  due_at?: string;
  paid_at?: string;
  created_at?: string;
  updated_at?: string;
  items?: DtoAdminOrderItemView[];
}

export type GetAdminInvoicesId200 = UtilsResponse & {
  data?: DtoInvoiceDetailResponse;
};

export interface DtoUpdateInvoiceStatusRequest {
  status: 'draft' | 'issued' | 'paid' | 'void' | 'refunded';
}

export type PutAdminInvoicesIdStatus200 = UtilsResponse;
