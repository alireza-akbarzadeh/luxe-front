'use client';

import type { ReactNode } from 'react';

import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { ProductDetailProvider } from '../context/product-detail-context';
import { ProductGallery } from './product-gallery';

interface ProductDetailHeroProps {
  product: DtoProductWithLike;
  isLiked: boolean;
  discount: number;
  children: ReactNode;
}

/** Client PDP hero grid — shares cart/compare/share state between gallery and info. */
export function ProductDetailHero({
  product,
  isLiked,
  discount,
  children
}: ProductDetailHeroProps) {
  return (
    <ProductDetailProvider isLiked={isLiked} product={product}>
      <div className='mt-0 grid items-start gap-0 lg:mt-14 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-14 lg:px-8 xl:gap-20'>
        <div className='min-w-0'>
          <ProductGallery discount={discount} product={product} />
        </div>
        {children}
      </div>
    </ProductDetailProvider>
  );
}
