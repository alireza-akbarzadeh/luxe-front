export interface UtilsResponse {
  code?: number;
  error?: string;
  message?: string;
  success?: boolean;
}

export type GetAdminShipmentsParams = {
  /** Filter by legacy status */
  status?: string;
  /** Filter by carrier */
  carrier?: string;
  /** Filter by order ID */
  order_id?: number;
  /** Search tracking, order #, or carrier */
  search?: string;
  /** Items per page */
  limit?: number;
  /** Offset */
  offset?: number;
};
