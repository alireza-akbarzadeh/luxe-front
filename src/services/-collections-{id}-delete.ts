import { customInstance } from '../lib/api/api-client';

import type { UtilsResponse } from './-collections-{id}-delete.schemas';

type RequestOptions = Parameters<typeof customInstance>[1];

export const deleteCollectionsId = (id: number, options?: RequestOptions) =>
  customInstance<UtilsResponse>({ url: `/collections/${id}`, method: 'DELETE' }, options);
