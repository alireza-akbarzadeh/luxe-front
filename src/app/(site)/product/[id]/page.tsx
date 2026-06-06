import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import ProductDetailDomain from '~/src/domains/product/product-detail-domain';
import { prefetchWithAuth } from '~/src/lib/prefetch-with-auth';
import { getGetProductsIdQueryOptions } from '~/src/services/-products-{id}-get';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage(props: ProductPageProps) {
  const { params } = props;
  const { id } = await params;

  const queryClient = await prefetchWithAuth(getGetProductsIdQueryOptions, id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailDomain productId={id} />
    </HydrationBoundary>
  );
}
