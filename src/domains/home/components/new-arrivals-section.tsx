import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { HOME_PRODUCT_COLUMNS, HOME_RAIL_SECTION_CLASS } from '@/domains/home/lib/home-density';
import { ProductCard } from '@/domains/shop/components/product-card';
import { getHomeNewArrivals } from '@/services/-home-new-arrivals-get';

const NEW_ARRIVALS_LIMIT = 10;

export async function NewArrivalsSection() {
  const t = await getTranslations('home');

  const data = await getHomeNewArrivals({ limit: NEW_ARRIVALS_LIMIT });
  const products = data?.data?.products ?? [];

  if (products.length === 0) {
    return null;
  }

  return (
    <SectionCarousel
      sectionId='new-arrivals'
      className={HOME_RAIL_SECTION_CLASS}
      eyebrow={t('newArrivals.eyebrow')}
      title={t('newArrivals.title')}
      description={t('newArrivals.description')}
      viewAllHref='/shop?sortBy=newest'
      viewAllLabel={t('newArrivals.linkLabel')}
      columns={HOME_PRODUCT_COLUMNS}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id ?? index} product={product} index={index} size='dense' />
      ))}
    </SectionCarousel>
  );
}
