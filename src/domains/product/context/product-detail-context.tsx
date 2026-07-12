'use client';

import { createContext, type ReactNode, use } from 'react';

import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { useProductInfo } from '../hooks/use-product-info';

type ProductDetailContextValue = ReturnType<typeof useProductInfo> & {
  product: DtoProductWithLike;
  isLiked: boolean;
};

const ProductDetailContext = createContext<ProductDetailContextValue | null>(null);

/** Shares cart, compare, and share handlers between PDP gallery toolbar and info column. */
export function ProductDetailProvider({
  product,
  isLiked,
  children
}: {
  product: DtoProductWithLike;
  isLiked: boolean;
  children: ReactNode;
}) {
  const info = useProductInfo(product);

  return (
    <ProductDetailContext value={{ ...info, product, isLiked }}>{children}</ProductDetailContext>
  );
}

export function useProductDetailContext() {
  const value = use(ProductDetailContext);
  if (!value) {
    throw new Error('useProductDetailContext must be used within ProductDetailProvider');
  }
  return value;
}

export function useProductDetailContextOptional() {
  return use(ProductDetailContext);
}
