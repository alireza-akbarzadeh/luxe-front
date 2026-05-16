import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { ShopDomain } from '~/src/domains/shop/shop.domain';
import { getQueryClient } from '~/src/lib/query-clinet';
import { getGetProductsQueryOptions } from '~/src/services/-products-get';

export default async function ShopPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const queryClient = getQueryClient();

  const options = {
    request: {
      headers: { Cookie: cookieHeader }
    }
  };

  await queryClient.prefetchQuery(getGetProductsQueryOptions({}, options));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ShopDomain />
    </HydrationBoundary>
  );
}
