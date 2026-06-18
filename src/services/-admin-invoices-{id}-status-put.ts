import { useMutation } from '@tanstack/react-query';
import type { MutationFunction, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import type {
  DtoUpdateInvoiceStatusRequest,
  PutAdminInvoicesIdStatus200
} from './-admin-invoices.schemas';

import { customInstance } from '../lib/api/api-client';

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const putAdminInvoicesIdStatus = (
  id: number,
  dtoUpdateInvoiceStatusRequest: DtoUpdateInvoiceStatusRequest,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal
) => {
  return customInstance<PutAdminInvoicesIdStatus200>(
    {
      url: `/admin/invoices/${id}/status`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      data: dtoUpdateInvoiceStatusRequest,
      signal
    },
    options
  );
};

export const usePutAdminInvoicesIdStatus = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof putAdminInvoicesIdStatus>>,
      TError,
      { id: number; data: DtoUpdateInvoiceStatusRequest },
      TContext
    >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseMutationResult<
  Awaited<ReturnType<typeof putAdminInvoicesIdStatus>>,
  TError,
  { id: number; data: DtoUpdateInvoiceStatusRequest },
  TContext
> => {
  const mutationKey = ['putAdminInvoicesIdStatus'];
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putAdminInvoicesIdStatus>>,
    { id: number; data: DtoUpdateInvoiceStatusRequest }
  > = (props) => {
    const { id, data } = props;
    return putAdminInvoicesIdStatus(id, data, requestOptions);
  };

  return useMutation({
    mutationKey,
    mutationFn,
    ...mutationOptions
  });
};
