import { customInstance } from '../lib/api/api-client';

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getAdminInvoicesIdPdf = (
  id: number,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal
) => {
  return customInstance<Blob>(
    {
      url: `/admin/invoices/${id}/pdf`,
      method: 'GET',
      responseType: 'blob',
      signal
    },
    options
  );
};
