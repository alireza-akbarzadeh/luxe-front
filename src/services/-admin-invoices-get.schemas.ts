export interface UtilsResponse {
  code?: number;
  error?: string;
  message?: string;
  success?: boolean;
}

export type GetAdminInvoicesParams = {
  status?: string;
  user_id?: number;
  order_id?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
};
