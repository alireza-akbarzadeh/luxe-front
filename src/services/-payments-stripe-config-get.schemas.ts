/**
 * Hand-maintained until `pnpm api:gen` includes stripe-config in OpenAPI.
 */
export interface UtilsResponse {
  code?: number;
  error?: string;
  message?: string;
  success?: boolean;
}

export interface DtoStripeConfigResponse {
  enabled?: boolean;
  publishable_key?: string;
}

export type GetPaymentsStripeConfig200 = UtilsResponse & {
  data?: DtoStripeConfigResponse;
};
