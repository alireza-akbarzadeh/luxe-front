import { describe, expect, it } from 'vitest';

import { AxiosError, AxiosHeaders, CanceledError, type InternalAxiosRequestConfig } from 'axios';

import {
  extractErrorMessage,
  getErrorMessage,
  getServerErrorMessage,
  isForbiddenError,
  isNetworkError,
  isRateLimitError,
  isRequestCancelled,
  isTimeoutError,
  isUnauthorizedError
} from '@/lib/api/api-utils';
import type { ApiErrorResponse } from '@/lib/api/type';

const emptyConfig = { headers: new AxiosHeaders() } as InternalAxiosRequestConfig;

function createAxiosError(
  overrides: Partial<AxiosError<ApiErrorResponse>> & {
    response?: AxiosError<ApiErrorResponse>['response'];
  } = {}
): AxiosError<ApiErrorResponse> {
  const error = new AxiosError(
    overrides.message ?? 'Request failed',
    overrides.code,
    overrides.config ?? emptyConfig,
    overrides.request,
    overrides.response
  );
  return error;
}

describe('api-utils error classification', () => {
  it('detects cancelled requests', () => {
    expect(isRequestCancelled(new CanceledError())).toBe(true);
    expect(isRequestCancelled(new Error('nope'))).toBe(false);
  });

  it('detects network errors without a response', () => {
    const error = createAxiosError({
      code: 'ERR_NETWORK',
      message: 'Network Error',
      request: {}
    });
    expect(isNetworkError(error)).toBe(true);
  });

  it('does not treat 401 responses as network errors', () => {
    const error = createAxiosError({
      message: 'Unauthorized',
      response: {
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: emptyConfig
      }
    });
    expect(isNetworkError(error)).toBe(false);
  });

  it('detects timeout errors', () => {
    const error = createAxiosError({
      code: 'ECONNABORTED',
      message: 'timeout of 5000ms exceeded'
    });
    expect(isTimeoutError(error)).toBe(true);
  });

  it('detects unauthorized, forbidden, and rate-limit statuses', () => {
    const unauthorized = createAxiosError({
      response: {
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: emptyConfig
      }
    });
    const forbidden = createAxiosError({
      response: { status: 403, data: {}, statusText: 'Forbidden', headers: {}, config: emptyConfig }
    });
    const rateLimited = createAxiosError({
      response: {
        status: 429,
        data: {},
        statusText: 'Too Many Requests',
        headers: {},
        config: emptyConfig
      }
    });

    expect(isUnauthorizedError(unauthorized)).toBe(true);
    expect(isForbiddenError(forbidden)).toBe(true);
    expect(isRateLimitError(rateLimited)).toBe(true);
  });
});

describe('extractErrorMessage', () => {
  it('formats validation error arrays', () => {
    const error = createAxiosError({
      response: {
        status: 422,
        statusText: 'Unprocessable Entity',
        headers: {},
        config: emptyConfig,
        data: {
          errors: [{ field: 'email', message: 'Invalid email address' }]
        } as unknown as ApiErrorResponse
      }
    });

    expect(extractErrorMessage(error)).toBe('email: Invalid email address');
  });

  it('prefers message then error fields from API payloads', () => {
    const withMessage = createAxiosError({
      response: {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: emptyConfig,
        data: { message: 'Coupon expired' }
      }
    });
    const withErrorField = createAxiosError({
      response: {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: emptyConfig,
        data: { error: 'Invalid payload' }
      }
    });

    expect(getServerErrorMessage(withMessage)).toBe('Coupon expired');
    expect(extractErrorMessage(withMessage)).toBe('Coupon expired');
    expect(extractErrorMessage(withErrorField)).toBe('Invalid payload');
  });

  it('prefers server message over validation error arrays', () => {
    const error = createAxiosError({
      response: {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: emptyConfig,
        data: {
          message: 'validación fallida',
          errors: [{ field: 'email', message: 'required' }]
        } as unknown as ApiErrorResponse
      }
    });

    expect(extractErrorMessage(error)).toBe('validación fallida');
  });

  it('returns a network hint when the server never responded', () => {
    const error = createAxiosError({
      message: 'Network Error',
      request: {}
    });

    expect(extractErrorMessage(error)).toBe(
      'No response from server. Check your network connection.'
    );
  });
});

describe('getErrorMessage', () => {
  it('reads message, error, or axios message in order', () => {
    const error = createAxiosError({
      message: 'fallback',
      response: {
        status: 500,
        statusText: 'Server Error',
        headers: {},
        config: emptyConfig,
        data: { message: 'Inventory unavailable' }
      }
    });

    expect(getErrorMessage(error)).toBe('Inventory unavailable');
  });
});
