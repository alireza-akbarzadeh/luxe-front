// src/lib/api-client.ts
import Axios, {
  AxiosError,
  HttpStatusCode,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';

import { toast } from 'sonner';
import { APP_CONFIG } from '../config';
import { handleApiError } from './handle-api-error';
import type { ApiClientOptions, ApiErrorResponse } from './type';
import { isRequestCancelled } from './api-utils';
import { logger } from './logger';

export const BASE_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8080/api/v1';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: APP_CONFIG.API_DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// ---------- Refresh token queue (unchanged) ----------
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      resolve(AXIOS_INSTANCE(config));
    }
  });
  failedQueue = [];
};

// ---------- Response interceptor (unchanged) ----------
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const showErrorToast = () => {
      let errorMessage = 'An unexpected error occurred';
      if (error.response?.data) {
        const data = error.response.data as any;
        errorMessage = data.message || data.error || JSON.stringify(data);
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your network.';
      } else {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    };

    // If not a 401 or already retried, show error and reject
    if (error.response?.status !== HttpStatusCode.Unauthorized || originalRequest._retry) {
      if (error.response?.status === HttpStatusCode.Unauthorized) {
        toast.error('Authentication failed. Please log in again.');
      } else if (error.response?.status === HttpStatusCode.Forbidden) {
        toast.error('You do not have permission to perform this action.');
      } else {
        showErrorToast();
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;

    try {
      // ✅ Direct call to your Go backend (no body, cookie is sent automatically)
      const refreshResponse = await AXIOS_INSTANCE.post(
        '/auth/refresh',
        null, // no body – cookie contains refresh_token
        { withCredentials: true } // sends httpOnly cookie
      );

      const newAccessToken = refreshResponse.data.data?.access_token;
      if (!newAccessToken) throw new Error('No access token in refresh response');

      // Process queued requests with the new token
      processQueue(null, newAccessToken);

      // Retry the original request with the new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return AXIOS_INSTANCE(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      toast.error('Session expired. Please log in again.');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
/**
 * Enhanced API client with error handling and toast notifications
 * @param config - Axios request configuration
 * @param options - Additional options for the API client
 * @returns Promise resolving to the API response data
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
    console.warn('Received error response but no data:', axiosError.response);
    throw axiosError;
  }
};
