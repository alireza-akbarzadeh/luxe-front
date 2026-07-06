'use client';

import { useTranslations } from 'next-intl';

import { usePdpInsightStages } from '@/domains/product/hooks/use-pdp-insight-stages';
import { useWhenVisible } from '@/domains/product/hooks/use-when-visible';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { ProductDeliveryPrediction } from './product-delivery-prediction';
import { ProductDurabilityScore } from './product-durability-score';
import { ProductMarketSnapshot } from './product-market-snapshot';
import { ProductNegotiation } from './product-negotiation';
import { ProductPriceChart } from './product-price-chart';
import { ProductPurchaseAdvisor } from './product-purchase-advisor';
import { ProductReturnRiskInsight } from './product-return-risk-insight';
import { ProductStockHeatmap } from './product-stock-heatmap';
import { ProductSustainabilityScore } from './product-sustainability-score';
import { ProductTimeline } from './product-timeline';
import { ProductTrustScore } from './product-trust-score';

interface ProductInsightsSectionProps {
  productId: string;
  numericProductId: number;
  product: DtoProductWithLike;
}

/** PDP insights: deferred, staggered fetches to avoid blocking initial page load. */
export function ProductInsightsSection({
  productId,
  numericProductId,
  product
}: ProductInsightsSectionProps) {
  const t = useTranslations('pdp');
  const { ref, visible } = useWhenVisible<HTMLElement>({ rootMargin: '280px 0px' });
  const { isStageReached } = usePdpInsightStages(visible);

  return (
    <section ref={ref} className='mt-12 lg:mt-16'>
      <div className='mb-6 max-w-2xl'>
        <h2 className='font-display text-2xl font-semibold tracking-tight'>{t('insightsTitle')}</h2>
        <p className='text-muted-foreground mt-2 text-sm'>{t('insightsDescription')}</p>
      </div>

      <div className='mb-6 grid items-stretch gap-6 lg:grid-cols-2'>
        <ProductTrustScore enabled={isStageReached('trust')} productId={numericProductId} />
        <ProductDurabilityScore
          enabled={isStageReached('durability')}
          productId={numericProductId}
        />
      </div>

      <ProductSustainabilityScore
        className='mb-6'
        enabled={isStageReached('sustainability')}
        productId={numericProductId}
      />

      <div className='grid items-stretch gap-6 lg:grid-cols-2'>
        <ProductPriceChart
          className='h-full'
          fetchEnabled={isStageReached('priceChart')}
          numericProductId={numericProductId}
          predictionEnabled={isStageReached('pricePrediction')}
          productId={productId}
        />
        <ProductMarketSnapshot
          compareAtPrice={product.compare_at_price}
          currentPrice={Number(product.price ?? 0)}
          fetchEnabled={isStageReached('market')}
          productId={productId}
          storeName={product.store?.name ?? t('thisListing')}
        />
      </div>

      <ProductReturnRiskInsight
        className='mt-6'
        enabled={isStageReached('returnRisk')}
        productId={numericProductId}
      />

      <ProductPurchaseAdvisor
        className='mt-6'
        enabled={isStageReached('purchaseAdvisor')}
        productId={numericProductId}
      />

      <div className='mt-6 grid items-stretch gap-6 lg:grid-cols-2'>
        <ProductDeliveryPrediction
          enabled={isStageReached('deliveryPrediction')}
          productId={numericProductId}
        />
        <ProductStockHeatmap enabled={isStageReached('stockHeatmap')} productId={productId} />
      </div>

      <ProductTimeline
        className='mt-6'
        enabled={isStageReached('timeline')}
        productId={productId}
      />

      <ProductNegotiation
        className='mt-6'
        listPrice={Number(product.price ?? 0)}
        productId={numericProductId}
      />
    </section>
  );
}
