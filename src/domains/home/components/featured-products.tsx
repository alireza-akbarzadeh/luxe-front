import { getTranslations } from 'next-intl/server';

import { FeaturedProductsSection } from '@/domains/home/components/ui/featured-products-section';
import type { FeaturedTrustItem } from '@/domains/home/components/ui/featured-products-trust-strip';
import { TRUST_ITEMS } from '@/domains/home/lib/home-mock-data';
import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { getHomeMarketingCopyParams } from '@/lib/i18n/marketing-copy-params';
import { getHomeNewArrivals } from '@/services/-home-new-arrivals-get';
import { getHomeTopProducts } from '@/services/-home-top-products-get';
import { getHomeTrendingProducts } from '@/services/-home-trending-products-get';

import { mapHomeProductItem } from '../lib/home-utils';

const PRODUCT_LIMIT = 8;

export async function FeaturedProducts() {
  const [t, tCommon, tHome] = await Promise.all([
    getTranslations('home.featured'),
    getTranslations('home.common'),
    getTranslations('home')
  ]);

  const copy = getHomeMarketingCopyParams();
  const trustItemParams = {
    freeShipping: { amount: copy.trust.amount },
    easyReturns: { days: copy.trust.days },
    secureCheckout: { bits: copy.trust.bits },
    support: { hours: copy.trust.hours, days: copy.trust.daysSupport }
  } as const;

  const trustItems: FeaturedTrustItem[] = TRUST_ITEMS.map((item) => ({
    icon: item.icon,
    title: tHome(`trust.items.${item.key}.title`, trustItemParams[item.key])
  }));

  const [topData, newData, trendingData] = await Promise.all([
    safeHomeFetch(() => getHomeTopProducts({ limit: PRODUCT_LIMIT })),
    safeHomeFetch(() => getHomeNewArrivals({ limit: PRODUCT_LIMIT })),
    safeHomeFetch(() => getHomeTrendingProducts({ limit: PRODUCT_LIMIT }))
  ]);

  const featuredProducts = (topData?.data?.products ?? []).map(mapHomeProductItem);
  const newProducts = (newData?.data?.products ?? []).map(mapHomeProductItem);
  const trendingProducts = (trendingData?.data?.products ?? []).map(mapHomeProductItem);

  if (featuredProducts.length === 0 && newProducts.length === 0 && trendingProducts.length === 0) {
    return null;
  }

  return (
    <FeaturedProductsSection
      featuredProducts={featuredProducts}
      newProducts={newProducts}
      trendingProducts={trendingProducts}
      trustItems={trustItems}
      t={{
        title: t('title'),
        description: t('description'),
        tabs: {
          featured: t('tabs.featured'),
          new: t('tabs.new'),
          trending: t('tabs.trending')
        },
        shopAll: tCommon('shopAll')
      }}
    />
  );
}
