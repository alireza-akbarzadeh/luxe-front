import { getTranslations } from 'next-intl/server';

import { PromoCountdown } from '@/domains/home/components/ui/promo-countdown';
import { HOME_RAIL_SECTION_CLASS } from '@/domains/home/lib/home-density';
import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { marketingNumbers } from '@/lib/i18n/marketing-numbers';
import { cn } from '@/lib/utils';
import { getHomeFlashDeals } from '@/services/-home-flash-deals-get';

import { sectionContainerClass } from '../lib/home-utils';

const FLASH_DEAL_LIMIT = 8;

export async function PromoSection() {
  const [t, tCommon] = await Promise.all([
    getTranslations('home.promo'),
    getTranslations('home.common')
  ]);

  const data = await safeHomeFetch(() => getHomeFlashDeals({ limit: FLASH_DEAL_LIMIT }));
  const deals = (data?.data?.deals ?? []).filter((deal) => deal.product && deal.ends_at);
  const lead = deals[0];
  const promoEnd = lead?.ends_at ? new Date(lead.ends_at) : null;

  if (!lead || !promoEnd || deals.length === 0) {
    return null;
  }

  const promoCode = t('code') || 'LUXE20';
  const product = lead.product;
  const discount =
    product?.discount_percent != null && product.discount_percent > 0
      ? product.discount_percent / 100
      : product?.compare_at_price != null &&
          product.price != null &&
          product.compare_at_price > product.price
        ? (product.compare_at_price - product.price) / product.compare_at_price
        : marketingNumbers.promoDiscountPercent;

  return (
    <section className={cn(HOME_RAIL_SECTION_CLASS, 'py-8 sm:py-10')}>
      <div className={sectionContainerClass}>
        <PromoCountdown
          promoEnd={promoEnd}
          deals={deals}
          promoCode={promoCode}
          t={{
            badge: t('badge'),
            title: t('title', { discount }),
            description: t('description', { discount, code: promoCode }),
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
