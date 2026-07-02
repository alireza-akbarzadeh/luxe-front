import { getTranslations } from 'next-intl/server';

import { PromoCountdown } from '@/domains/home/components/ui/promo-countdown';
import { marketingNumbers } from '@/lib/i18n/marketing-numbers';
import { getHomeFlashDeals } from '@/services/-home-flash-deals-get';

import { sectionContainerClass } from '../lib/home-utils';

export async function PromoSection() {
  const [t, tCommon] = await Promise.all([
    getTranslations('home.promo'),
    getTranslations('home.common')
  ]);

  // Fetch flash deal data
  const data = await getHomeFlashDeals({ limit: 1 });
  const deal = data?.data?.deals?.[0];
  const promoImage = deal?.product?.images?.[0];
  const promoEnd = deal?.ends_at ? new Date(deal.ends_at) : null;

  if (!deal || !promoEnd || !promoImage) {
    return null;
  }

  const promoCode = t('code') || 'LUXE20';

  const product = deal.product;
  const discount =
    product?.discount_percent != null && product.discount_percent > 0
      ? product.discount_percent / 100
      : product?.compare_at_price != null &&
          product.price != null &&
          product.compare_at_price > product.price
        ? (product.compare_at_price - product.price) / product.compare_at_price
        : marketingNumbers.promoDiscountPercent;

  return (
    <section className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <PromoCountdown
          promoEnd={promoEnd}
          promoImage={promoImage}
          deal={deal}
          promoCode={promoCode}
          t={{
            badge: t('badge'),
            title: t('title', { discount }),
            description: t('description', { code: promoCode }),
            shopSale: t('shopSale'),
            createAccount: t('createAccount'),
            countdown: {
              hours: t('countdown.hours'),
              minutes: t('countdown.minutes'),
              seconds: t('countdown.seconds')
            }
          }}
          common={{
            promoImageAlt: tCommon('promoImageAlt'),
            shopNow: tCommon('shopNow')
          }}
        />
      </div>
    </section>
  );
}
