'use client';

import { useTranslations } from 'next-intl';

import { useAuth } from '@/components/providers/auth-provider';
import { SectionCarousel } from '@/components/section-carousel';
import { HOME_PRODUCT_COLUMNS, HOME_RAIL_SECTION_CLASS } from '@/domains/home/lib/home-density';
import { mapHomeProductItem } from '@/domains/home/lib/home-utils';
import { ProductCard } from '@/domains/shop/components/product-card';
import { useGetHomeRecentlyViewed } from '@/services/-home-recently-viewed-get';
import { usePrivateShoppingStore } from '@/stores/private-shopping-store';

const PRODUCT_LIMIT = 12;

/** Signed-in homepage rail — products the shopper recently viewed on PDPs. */
export function RecentlyViewedHomeSection() {
  const t = useTranslations('home.recentlyViewed');
  const tCommon = useTranslations('home.common');
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const privateMode = usePrivateShoppingStore((s) => s.enabled);

  const { data, isLoading } = useGetHomeRecentlyViewed(
    { limit: PRODUCT_LIMIT },
    {
      query: {
        enabled: isAuthenticated && !privateMode,
        staleTime: 30_000
      }
    }
  );

  if (isAuthLoading || !isAuthenticated || privateMode) {
    return null;
  }

  const products = (data?.data?.products ?? []).map(mapHomeProductItem);

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <SectionCarousel
      sectionId='recently-viewed'
      className={HOME_RAIL_SECTION_CLASS}
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      viewAllHref='/shop'
      viewAllLabel={tCommon('shopAll')}
      columns={HOME_PRODUCT_COLUMNS}
      isLoading={isLoading}
      skeletonCount={5}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id ?? index} product={product} index={index} size='dense' />
      ))}
    </SectionCarousel>
  );
}
