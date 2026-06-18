import { useMutation } from '@tanstack/react-query';
import type { MutationFunction, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import type { UtilsResponse } from './-admin-invoices-get.schemas';

import { customInstance } from '../lib/api/api-client';

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const postAdminInvoicesIdSend = (
  id: number,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal
) => {
  return customInstance<UtilsResponse>(
    { url: `/admin/invoices/${id}/send`, method: 'POST', signal },
    options
  );
};

export const usePostAdminInvoicesIdSend = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof postAdminInvoicesIdSend>>,
      TError,
      { id: number },
      TContext
    >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseMutationResult<
  Awaited<ReturnType<typeof postAdminInvoicesIdSend>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAdminInvoicesIdSend>>,
    { id: number }
  > = ({ id }) => postAdminInvoicesIdSend(id, requestOptions);

  return useMutation({
    mutationKey: ['postAdminInvoicesIdSend'],
    mutationFn,
    ...mutationOptions
  });
};
