import Axios, { AxiosError } from 'axios';

import type { ApiErrorResponse } from './type';

/**
 * Checks if an error is a cancelled request error
 * @param error - The error to check
 * @returns Boolean indicating if the error is from a cancelled request
 */
export const isRequestCancelled = (error: unknown): boolean => {
  return Axios.isCancel(error as AxiosError);
};

/**
 * Utility function to check if an error is a network error
 * @param error - The error to check
 * @returns Boolean indicating if the error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  return (
    error instanceof AxiosError &&
    !error.response && // Make sure there's no response (401 errors have response)
    Boolean(error.code) &&
    // ECONNABORTED for timeout
    // ECONNREFUSED, ENOTFOUND, etc. for other network errors
    error.message.includes('Network Error')
  );
};

/**
 * Utility function to check if an error is a timeout error
 * @param error - The error to check
 * @returns Boolean indicating if the error is a timeout error
 */
export const isTimeoutError = (error: unknown): boolean => {
  return (
    error instanceof AxiosError &&
    error.code === 'ECONNABORTED' &&
    error.message.includes('timeout')
  );
};

/**
 * Utility function to check if an error is an unauthorized error (401)
 * @param error - The error to check
 * @returns Boolean indicating if the error is an unauthorized error
 */
export const isUnauthorizedError = (error: unknown): boolean => {
  if (!(error instanceof AxiosError)) return false;

  // Check for standard 401 status code
  if (error.response?.status === 401) return true;

  // Check for error message containing 401
  if (error.message?.includes('401')) return true;

  // Check for bad request errors that might be auth-related
  if (error.code === 'ERR_BAD_REQUEST' && error.message?.includes('401')) return true;

  return false;
};

/**
 * Utility function to check if an error is a forbidden error (403)
 * @param error - The error to check
 * @returns Boolean indicating if the error is a forbidden error
 */
export const isForbiddenError = (error: unknown): boolean => {
  if (!(error instanceof AxiosError)) return false;
  return error.response?.status === 403;
};

/**
 * Utility function to check if an error is a rate limit error (429)
 * @param error - The error to check
 * @returns Boolean indicating if the error is a rate limit error
 */
export const isRateLimitError = (error: unknown): boolean => {
  if (!(error instanceof AxiosError)) return false;
  return error.response?.status === 429;
};

/**
 * Utility function to extract error message from API error response
 * @param error - The axios error object
 * @returns The error message string
 */
export const getErrorMessage = (error: AxiosError<ApiErrorResponse>): string => {
  return (
    error.response?.data?.message || error.response?.data?.error || error.message || 'unkown error'
  );
};

// ---------- Error extractor ----------
/**
 * Pulls the most meaningful human-readable message from any Axios error shape.
 * Orval-generated schemas often wrap errors as { message, error, errors[] }.
 */
export function extractErrorMessage(error: AxiosError<ApiErrorResponse>): string {
  const data = error.response?.data as Record<string, unknown> | undefined;

  if (data) {
    // Handle validation arrays: { errors: [{ field, message }] }
    if (Array.isArray(data['errors']) && data['errors'].length > 0) {
      const first = data['errors'][0] as Record<string, unknown>;
      const field = typeof first['field'] === 'string' ? `${first['field']}: ` : '';
      const msg = typeof first['message'] === 'string' ? first['message'] : JSON.stringify(first);
      return `${field}${msg}`;
    }

    if (typeof data['message'] === 'string' && data['message']) {
      return data['message'];
    }
    if (typeof data['error'] === 'string' && data['error']) {
      return data['error'];
    }
  }

  if (!error.response && error.request) {
    return 'No response from server. Check your network connection.';
  }

  return error.message || 'An unexpected error occurred.';
}
