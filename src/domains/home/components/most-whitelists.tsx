import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { HOME_PRODUCT_COLUMNS, HOME_RAIL_SECTION_CLASS } from '@/domains/home/lib/home-density';
import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { ProductCard } from '@/domains/shop/components/product-card';
import { getHomeMostWishlisted } from '@/services/-home-most-wishlisted-get';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

const PRODUCT_LIMIT = 12;

export async function MostWhitelists() {
  const t = await getTranslations('home');

  const data = await safeHomeFetch(() => getHomeMostWishlisted({ limit: PRODUCT_LIMIT }));
  const wishlists = data?.data?.products ?? [];

  if (wishlists.length === 0) {
    return null;
  }

  return (
    <SectionCarousel
      sectionId='wishlists'
      className={HOME_RAIL_SECTION_CLASS}
      eyebrow={t('wishlists.eyebrow')}
      title={t('wishlists.title')}
      description={t('wishlists.description')}
      viewAllHref='/shop'
      viewAllLabel={t('common.shopAll')}
      columns={HOME_PRODUCT_COLUMNS}
    >
      {wishlists.map((product: DtoProductWithLike, index) => (
        <ProductCard key={product.id ?? index} product={product} index={index} size='dense' />
      ))}
    </SectionCarousel>
  );
}
