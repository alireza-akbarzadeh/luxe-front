'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/auth-provider';
import useCompareController from '@/domains/compare/hooks/useCompareController';
import { type CartItemPayload, useCartController } from '@/hooks/useCartController';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import { useCartStore } from '@/store/card.store';

import {
  getVariantPickerAttributes,
  resolveProductAttributeKind
} from '../lib/product-attribute.utils';

/** Cart, compare, share, and variant state for the PDP info column. */
export function useProductInfo(product: DtoProductWithLike) {
  const t = useTranslations('pdp.info');
  const tBreadcrumb = useTranslations('pdp.breadcrumb');
  const { formatInteger } = useLocaleFormatters();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { increment, decrement, itemCount, items, isLoading } = useCartController();
  const openCart = useCartStore((state) => state.openCart);
  const { addItem, isInCompare, canAddMore } = useCompareController();

  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({});
  const [configuratorPreset, setConfiguratorPreset] = useState<Record<string, string>>({});

  const cartItem = items.find((item) => item.product_id === product.id);
  const stock = product.stock ?? 0;
  const productQuantity = cartItem?.quantity ?? 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const inCompare = product.id ? isInCompare(product.id) : false;

  const selectedColor =
    variantSelections['color'] ??
    variantSelections['colors'] ??
    variantSelections['colour'] ??
    variantSelections['colours'];
  const selectedSize = variantSelections['size'] ?? variantSelections['sizes'];

  const hasSizeVariants = useMemo(
    () =>
      getVariantPickerAttributes(product.attributes, {
        colors: product.colors,
        sizes: product.sizes
      }).some((attribute) => resolveProductAttributeKind(attribute) === 'size'),
    [product.attributes, product.colors, product.sizes]
  );

  const discountAmount =
    product.compare_at_price && product.compare_at_price > Number(product.price ?? 0)
      ? product.compare_at_price - Number(product.price)
      : 0;

  const cartBadgeLabel = itemCount > 99 ? t('cartBadgeMax') : formatInteger(itemCount);

  const mapToBasket = (values: DtoProductWithLike): CartItemPayload => ({
    color: selectedColor,
    size: selectedSize,
    image_url: values.images?.[0],
    is_in_stock: Number(values.stock) > 0,
    price: values.price,
    product_id: values.id,
    product_name: values.name,
    stock: values.stock
  });

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    increment(mapToBasket(product));
  };

  const handleDecrement = () => {
    decrement(mapToBasket(product));
  };

  const handleCompare = () => {
    if (!product.id) return;
    if (!isAuthenticated) {
      toast.message(t('toastSignInCompare'));
      return;
    }
    if (inCompare) {
      router.push('/compare');
      return;
    }
    if (!canAddMore) {
      toast.info(t('toastCompareFull'));
      router.push('/compare');
      return;
    }
    void addItem(product.id);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name ?? tBreadcrumb('product'), url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success(t('toastLinkCopied'));
    } catch {
      toast.error(t('toastShareFailed'));
    }
  };

  return {
    variantSelections,
    setVariantSelections,
    configuratorPreset,
    setConfiguratorPreset,
    hasSizeVariants,
    stock,
    productQuantity,
    isOutOfStock,
    isLowStock,
    discountAmount,
    inCompare,
    itemCount,
    cartBadgeLabel,
    isLoading,
    handleAddToCart,
    handleDecrement,
    handleCompare,
    handleShare,
    openCart
  };
}
