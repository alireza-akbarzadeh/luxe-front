'use client';

import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { useProductDetailContext } from '../context/product-detail-context';
import { ProductConfiguratorTrigger } from './configurator/product-configurator-trigger';
import { ProductFeatureHighlights } from './product-feature-highlights';
import { ProductInfoActionBar } from './product-info/product-info-action-bar';
import { ProductInfoHeader } from './product-info/product-info-header';
import { ProductInfoOverview } from './product-info/product-info-overview';
import { ProductInfoPricing } from './product-info/product-info-pricing';
import { ProductInfoStockBadges } from './product-info/product-info-stock-badges';
import { ProductInfoTrustRow } from './product-info/product-info-trust-row';
import { ProductMobileActionBar } from './product-info/product-mobile-action-bar';
import ProductQuantity from './product-quantity';
import { ProductSizeRecommendation } from './product-size-recommendation';
import { ProductStockNotify } from './product-stock-notify';
import { ProductVariantAttributes } from './product-variant-attributes';

interface ProductInfoProps {
  product: DtoProductWithLike;
  is_liked: boolean;
}

export function ProductInfo({ product: _product, is_liked: _isLiked }: ProductInfoProps) {
  const {
    product,
    isLiked,
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
    isLoading,
    handleAddToCart,
    handleDecrement,
    handleCompare,
    handleShare,
    openCart,
    cartBadgeLabel,
    itemCount,
    subtotal
  } = useProductDetailContext();

  return (
    <div className='flex flex-col gap-7'>
      <div className='space-y-5'>
        <ProductInfoHeader product={product} />
        <ProductInfoPricing product={product} discountAmount={discountAmount} />
        <ProductInfoStockBadges
          product={product}
          stock={stock}
          isOutOfStock={isOutOfStock}
          isLowStock={isLowStock}
        />
        <ProductInfoOverview product={product} />
      </div>

      <ProductVariantAttributes
        attributes={product.attributes}
        colors={product.colors}
        sizes={product.sizes}
        presetSelections={configuratorPreset}
        onSelectionChange={setVariantSelections}
      />

      {product.id ? (
        <ProductConfiguratorTrigger
          productId={product.id}
          productName={product.name}
          attributes={product.attributes}
          colors={product.colors}
          sizes={product.sizes}
          currentPreferences={variantSelections}
          onApplySelections={setConfiguratorPreset}
        />
      ) : null}

      {hasSizeVariants && product.id ? <ProductSizeRecommendation productId={product.id} /> : null}

      <ProductFeatureHighlights attributes={product.attributes} />

      <div className='hidden lg:block'>
        <ProductQuantity
          value={productQuantity}
          onIncrement={handleAddToCart}
          onDecrement={handleDecrement}
          stock={stock}
        />
      </div>

      <div className='space-y-3 pt-1'>
        <div className='hidden lg:block'>
          <ProductInfoActionBar
            product={product}
            isLiked={isLiked}
            isLoading={isLoading}
            isOutOfStock={isOutOfStock}
            inCompare={inCompare}
            itemCount={itemCount}
            cartBadgeLabel={cartBadgeLabel}
            onAddToCart={handleAddToCart}
            onShare={handleShare}
            onCompare={handleCompare}
            onOpenCart={openCart}
          />
        </div>

        {isOutOfStock && product.id && product.slug ? (
          <ProductStockNotify
            productId={product.id}
            productSlug={product.slug}
            isOutOfStock={isOutOfStock}
          />
        ) : null}
      </div>

      <div className='hidden lg:block'>
        <ProductInfoTrustRow />
      </div>

      <ProductMobileActionBar
        product={product}
        price={Number(product.price ?? 0)}
        subtotal={subtotal}
        productQuantity={productQuantity}
        stock={stock}
        isLoading={isLoading}
        isOutOfStock={isOutOfStock}
        isLowStock={isLowStock}
        onAddToCart={handleAddToCart}
        onDecrement={handleDecrement}
      />
    </div>
  );
}
