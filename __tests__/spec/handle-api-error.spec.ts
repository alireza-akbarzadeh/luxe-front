import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AxiosError } from 'axios';

import { handleApiError } from '@/lib/api/handle-api-error';
import { localeCookieName } from '@/i18n/config';

const toastError = vi.fn();

vi.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args)
  }
}));

vi.mock('@/lib/api/logger', () => ({
  logger: { info: vi.fn() }
}));

function createAxiosError(status: number, data?: Record<string, unknown>): AxiosError {
  return new AxiosError('Request failed', undefined, { url: '/test' }, {}, {
    status,
    statusText: 'Error',
    headers: {},
    config: {},
    data
  });
}

describe('handleApiError', () => {
  beforeEach(() => {
    toastError.mockClear();
    document.cookie = `${localeCookieName}=es; path=/`;
  });

  it('shows server message as-is without English status prefix', () => {
    handleApiError(
      createAxiosError(400, { message: 'correo electrónico o contraseña inválidos' }),
      { url: '/auth/login' },
      {}
    );

    expect(toastError).toHaveBeenCalledWith('correo electrónico o contraseña inválidos');
  });

  it('uses localized client fallback when the API sends no message', () => {
    handleApiError(createAxiosError(403, {}), { url: '/admin/users' }, {});

    expect(toastError).toHaveBeenCalledWith('No tiene permiso para realizar esta acción.');
  });

  it('uses localized network copy when there is no HTTP status', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK', { url: '/products' }, {});
    handleApiError(error, { url: '/products' }, {});

    expect(toastError).toHaveBeenCalledWith(
      'Sin respuesta del servidor. Compruebe su conexión de red.'
    );
  });
});
