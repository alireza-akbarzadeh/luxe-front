/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/prefetch-with-auth.ts
import { cookies } from 'next/headers';

import { getQueryClient } from './query-client';

export async function prefetchWithAuth(
  queryOptionsFn: (id: string, options?: any) => any,
  id: string
) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const queryClient = getQueryClient();

  const options = {
    request: {
      headers: { Cookie: cookieHeader }
    }
  };

  const queryOptions = queryOptionsFn(id, options);
  await queryClient.prefetchQuery(queryOptions);
  return queryClient;
}
