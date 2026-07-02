/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api-client.ts
import Axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  HttpStatusCode,
  type InternalAxiosRequestConfig,
  isCancel
} from 'axios';
import { toast } from 'sonner';

import {
  clearClientAccessToken,
  ensureClientAccessToken,
  setClientAccessToken
} from '../auth/auth-token-client';
import { APP_CONFIG } from '../config';
import { getErrorMessages } from '../i18n/error-messages';
import {
  getClientLocaleFromCookie,
  getRequestLocale,
  localeToAcceptLanguage
} from '../i18n/request-locale';
import { isRequestCancelled } from './api-utils';
import { handleApiError } from './handle-api-error';
import { logger } from './logger';
import type { ApiClientOptions, ApiErrorResponse } from './type';

/** Direct Go API URL for server-side calls (Server Actions, route handlers). */
export const BASE_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8080/api/v1';

/** Same-origin path proxied to BASE_URL via next.config rewrites (browser only). */
const BROWSER_API_BASE_URL = '/api/v1';

const NEXT_API = Axios.create({
  baseURL: '',
  withCredentials: true
});

export const AXIOS_INSTANCE = Axios.create({
  baseURL: typeof window === 'undefined' ? BASE_URL : BROWSER_API_BASE_URL,
  withCredentials: true,
  timeout: APP_CONFIG.API_DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Refresh token queue management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}> = [];

/**
 * Process all queued requests after token refresh
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      resolve(AXIOS_INSTANCE(config));
    } else {
      reject(new Error('No token available'));
    }
  });
  failedQueue = [];
};

AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  const locale =
    typeof window === 'undefined' ? await getRequestLocale() : getClientLocaleFromCookie();

  config.headers['Accept-Language'] = localeToAcceptLanguage(locale);

  const token = await ensureClientAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor with improved refresh logic
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    // Don't retry cancelled requests
    if (isCancel(error) || error?.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    // Handle non-401 errors — toasts are shown by customInstance/handleApiError (no redirect).
    if (error.response?.status !== HttpStatusCode.Unauthorized) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - token refresh logic

    // Don't retry if this is a refresh endpoint or already retried
    if (originalRequest.url?.includes('/auth/refresh') || originalRequest._retry) {
      clearClientAccessToken();
      toast.error(getErrorMessages(getClientLocaleFromCookie()).sessionExpired);

      // Clear local storage/cookies if needed
      if (typeof window !== 'undefined') {
        // Redirect to log in
        window.location.href = '/login?session=expired';
      }
      return Promise.reject(error);
    }

    // Initialize retry count
    originalRequest._retryCount = originalRequest._retryCount || 0;

    // Max retry limit
    if (originalRequest._retryCount >= APP_CONFIG.MAX_RETRY_LIMIT) {
      clearClientAccessToken();
      toast.error(getErrorMessages(getClientLocaleFromCookie()).authFailed);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    originalRequest._retryCount += 1;

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await NEXT_API.post('/api/auth/refresh', null, {
        withCredentials: true
      });
      const newAccessToken = refreshResponse.data.access_token;

      if (!newAccessToken) {
        throw new Error('No access token in refresh response');
      }

      setClientAccessToken(newAccessToken);
      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return AXIOS_INSTANCE(originalRequest);
    } catch (refreshError) {
      try {
        const tokenResponse = await NEXT_API.get('/api/auth/token', {
          withCredentials: true
        });
        const fallbackToken = tokenResponse.data?.access_token as string | undefined;

        if (tokenResponse.status === 200 && fallbackToken) {
          setClientAccessToken(fallbackToken);
          processQueue(null, fallbackToken);
          originalRequest.headers.Authorization = `Bearer ${fallbackToken}`;
          return AXIOS_INSTANCE(originalRequest);
        }
      } catch {
        // Fall through to session expiry handling.
      }

      clearClientAccessToken();
      processQueue(refreshError as Error, null);
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * Enhanced API client with error handling and toast notifications
 */
export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: ApiClientOptions
): Promise<T> => {
  const apiOptions: ApiClientOptions = options || {};

  try {
    const response: AxiosResponse = await AXIOS_INSTANCE({
      ...config,
      ...apiOptions,
      cancelToken: apiOptions.cancelToken?.token
    });

    // Log response if requested
    if (apiOptions.logResponse) {
      logger.info(`API Response [${config.url}]:`, response.data);
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Don't handle cancelled requests
    if (isRequestCancelled(axiosError)) {
      throw axiosError;
    }

    if (apiOptions.customErrorHandler) {
      apiOptions.customErrorHandler(axiosError);
    } else {
      handleApiError(axiosError, config, apiOptions);
    }

    if (axiosError.response && axiosError.response.data) {
      return axiosError.response.data as unknown as T;
    }

    if (process.env['NODE_ENV'] !== 'production') {
      logger.warn('Received error response but no data:', axiosError.response);
    }
    throw axiosError;
  }
};
