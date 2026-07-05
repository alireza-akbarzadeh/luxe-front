import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { ProductAiBriefButton } from '../product-ai-brief-sheet';
import { ProductVisualizationActions } from '../visualization/product-visualization-actions';

interface ProductInfoOverviewProps {
  product: DtoProductWithLike;
}

export function ProductInfoOverview({ product }: ProductInfoOverviewProps) {
  if (!product.description && !product.id) {
    return null;
  }

  return (
    <>
      {product.description ? (
        <p className='text-muted-foreground max-w-xl text-sm leading-relaxed sm:text-[15px]'>
          {product.description}
        </p>
      ) : null}
      {product.id ? (
        <>
          <ProductAiBriefButton productId={product.id} productName={product.name} />
          <ProductVisualizationActions productId={product.id} productName={product.name} />
        </>
      ) : null}
    </>
  );
}
