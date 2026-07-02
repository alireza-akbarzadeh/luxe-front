import { getTranslations } from 'next-intl/server';

import { FeaturedProductsSection } from '@/domains/home/components/ui/featured-products-section';
import { getHomeNewArrivals } from '@/services/-home-new-arrivals-get';
import { getHomeTopProducts } from '@/services/-home-top-products-get';
import { getHomeTrendingProducts } from '@/services/-home-trending-products-get';

import { mapHomeProductItem } from '../lib/home-utils';

const PRODUCT_LIMIT = 8;

export async function FeaturedProducts() {
  const [t, tCommon] = await Promise.all([
    getTranslations('home.featured'),
    getTranslations('home.common')
  ]);

  // Fetch all three in parallel
  const [topData, newData, trendingData] = await Promise.all([
    getHomeTopProducts({ limit: PRODUCT_LIMIT }),
    getHomeNewArrivals({ limit: PRODUCT_LIMIT }),
    getHomeTrendingProducts({ limit: PRODUCT_LIMIT })
  ]);

  const featuredProducts = (topData.data?.products ?? []).map(mapHomeProductItem);
  const newProducts = (newData.data?.products ?? []).map(mapHomeProductItem);
  const trendingProducts = (trendingData.data?.products ?? []).map(mapHomeProductItem);

  if (featuredProducts.length === 0 && newProducts.length === 0 && trendingProducts.length === 0) {
    return null;
  }

  return (
    <FeaturedProductsSection
      featuredProducts={featuredProducts}
      newProducts={newProducts}
      trendingProducts={trendingProducts}
      t={{
        eyebrow: t('eyebrow'),
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
