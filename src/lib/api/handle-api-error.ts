import { AxiosError, HttpStatusCode, type AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import type { ApiClientOptions, ApiErrorResponse } from './type';
import { logger } from '@/lib/api/logger';
import { extractErrorMessage } from '@/lib/api/api-utils';

/**
 * Handle API errors with appropriate toast notifications
 * @param axiosError - The axios error object
 * @param config - The request configuration
 * @param apiOptions - Additional API client options
 */
// ---------- Advanced error handler ----------
// ---------- Advanced error handler ----------
export const handleApiError = (
  axiosError: AxiosError<ApiErrorResponse>,
  config: AxiosRequestConfig,
  apiOptions: ApiClientOptions
): void => {
  if (typeof window === 'undefined' || apiOptions.skipToast) return;

  const message = extractErrorMessage(axiosError);
  const status = axiosError.response?.status;
  const url = config.url ?? '';

  if (!status) {
    // Network-level failure (no response at all)
    toast.error(`Network error: ${message}`);
    return;
  }

  switch (status) {
    // ── 4xx client errors ────────────────────────────────
    case HttpStatusCode.BadRequest:
      toast.error(`Bad request — ${message}`);
      break;

    case HttpStatusCode.Unauthorized:
      toast.error('Your session has expired. Please log in again.');
      break;

    case HttpStatusCode.Forbidden:
      toast.error('You dont have permission to perform this action.');
      break;

    case HttpStatusCode.NotFound:
      toast.error(`Not found — ${message}`);
      break;

    case HttpStatusCode.Conflict:
      toast.error(`Conflict — ${message}`);
      break;

    case HttpStatusCode.UnprocessableEntity:
      // Most common for validation; message already contains the first failing field
      toast.error(`Validation error — ${message}`);
      break;

    case HttpStatusCode.TooManyRequests: {
      const retryAfter = axiosError.response?.headers?.['retry-after'];
      const suffix = retryAfter ? ` Try again in ${retryAfter}s.` : '';
      toast.error(`Too many requests.${suffix}`);
      break;
    }

    // ── 5xx server errors ────────────────────────────────
    case HttpStatusCode.InternalServerError:
      if (!url.includes('Insight')) {
        toast.error(`Server error — ${message}`);
      }
      break;

    case HttpStatusCode.BadGateway:
    case HttpStatusCode.ServiceUnavailable:
    case HttpStatusCode.GatewayTimeout:
      toast.error('The server is temporarily unavailable. Please try again shortly.');
      break;

    default:
      toast.error(message);
  }

  // Always log full error in non-production for debugging
  if (process.env['NODE_ENV'] !== 'production') {
    logger.info(`[API error] ${axiosError.config?.method?.toUpperCase()} ${url}`, {
      status,
      data: axiosError.response?.data
    });
  }
};
