import { AxiosError, type AxiosRequestConfig, HttpStatusCode } from 'axios';
import { toast } from 'sonner';

import { extractErrorMessage, getServerErrorMessage, isNetworkError } from '@/lib/api/api-utils';
import { logger } from '@/lib/api/logger';
import { formatErrorMessage, getErrorMessages } from '@/lib/i18n/error-messages';
import { getClientLocaleFromCookie } from '@/lib/i18n/request-locale';

import type { ApiClientOptions, ApiErrorResponse } from './type';

function responseHasPayload(error: AxiosError<ApiErrorResponse>): boolean {
  const data = error.response?.data;
  if (data == null) return false;
  if (typeof data === 'object') return Object.keys(data).length > 0;
  return false;
}

function resolveToastMessage(
  error: AxiosError<ApiErrorResponse>,
  serverMessage: string | undefined,
  detail: string,
  fallback: string
): string {
  if (serverMessage) return serverMessage;
  if (responseHasPayload(error) && detail) return detail;
  return fallback;
}

/**
 * Show API errors in toasts. Server `message` is shown as-is (localized via Accept-Language).
 * Client-only fallbacks use the active UI locale from the cookie.
 */
export const handleApiError = (
  axiosError: AxiosError<ApiErrorResponse>,
  config: AxiosRequestConfig,
  apiOptions: ApiClientOptions
): void => {
  if (typeof window === 'undefined' || apiOptions.skipToast) return;

  const t = getErrorMessages(getClientLocaleFromCookie());
  const serverMessage = getServerErrorMessage(axiosError);
  const detail = extractErrorMessage(axiosError);
  const status = axiosError.response?.status;
  const url = config.url ?? '';

  if (!status) {
    toast.error(
      isNetworkError(axiosError) || !axiosError.request
        ? t.network
        : formatErrorMessage(t.networkError, { detail })
    );
    return;
  }

  switch (status) {
    case HttpStatusCode.BadRequest:
    case HttpStatusCode.NotFound:
    case HttpStatusCode.Conflict:
    case HttpStatusCode.UnprocessableEntity:
      toast.error(resolveToastMessage(axiosError, serverMessage, detail, t.unexpected));
      break;

    case HttpStatusCode.Unauthorized:
      toast.error(serverMessage ?? t.sessionExpired);
      break;

    case HttpStatusCode.Forbidden:
      toast.error(resolveToastMessage(axiosError, serverMessage, detail, t.forbiddenFallback));
      break;

    case HttpStatusCode.TooManyRequests: {
      if (serverMessage) {
        toast.error(serverMessage);
        break;
      }
      const retryAfter = axiosError.response?.headers?.['retry-after'];
      const suffix =
        typeof retryAfter === 'string' && retryAfter
          ? formatErrorMessage(t.tryAgainIn, { seconds: retryAfter })
          : '';
      toast.error(`${t.tooManyRequests}${suffix}`);
      break;
    }

    case HttpStatusCode.InternalServerError:
      if (!url.includes('Insight')) {
        toast.error(resolveToastMessage(axiosError, serverMessage, detail, t.unexpected));
      }
      break;

    case HttpStatusCode.BadGateway:
    case HttpStatusCode.ServiceUnavailable:
    case HttpStatusCode.GatewayTimeout:
      toast.error(serverMessage ?? t.serverUnavailable);
      break;

    default:
      toast.error(resolveToastMessage(axiosError, serverMessage, detail, t.unexpected));
  }

  if (process.env['NODE_ENV'] !== 'production') {
    logger.info(`[API error] ${axiosError.config?.method?.toUpperCase()} ${url}`, {
      status,
      data: axiosError.response?.data
    });
  }
};
