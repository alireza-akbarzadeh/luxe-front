'use client';

import { ProductReviewForm } from '@/domains/product/components/product-review-form';
import { ProductReviewList } from '@/domains/product/components/product-review-list';

interface ProductReviewsSectionProps {
  productId: number;
  productName: string;
}

/** Product reviews — summary, list, and authenticated write/edit form. */
export function ProductReviewsSection({ productId, productName }: ProductReviewsSectionProps) {
  return (
    <div className='grid gap-10 xl:grid-cols-[minmax(0,360px)_1fr] xl:gap-12'>
      <ProductReviewForm productId={productId} productName={productName} />
      <ProductReviewList productId={productId} />
    </div>
  );
}
