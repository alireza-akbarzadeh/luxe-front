import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { getShopLooks } from '@/services/-shop-looks-get';

import { ShopLookCard } from './shop-look-card';

const LOOK_LIMIT = 4;

/** Homepage carousel of shoppable lifestyle scenes. */
export async function ShopTheLookSection() {
  const t = await getTranslations('home.shopTheLook');

  const data = await safeHomeFetch(() => getShopLooks({ limit: LOOK_LIMIT }));
  const looks = data?.data?.looks ?? [];

  if (looks.length === 0) {
    return null;
  }

  return (
    <SectionCarousel
      sectionId='shop-the-look'
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      viewAllHref='/shop-the-look'
      viewAllLabel={t('viewAll')}
      columns={{ mobile: 1, tablet: 2, desktop: 2 }}
      loop={false}
    >
      {looks.map((look, index) => (
        <ShopLookCard
          key={look.id ?? index}
          look={look}
          eyebrow={t('eyebrow')}
          shopLabel={t('shopLabel')}
          piecesLabel={t('shoppablePieces', { count: look.tag_count ?? 0 })}
        />
      ))}
    </SectionCarousel>
  );
}
