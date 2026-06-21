import { marketingNumbers } from './marketing-numbers';

/** Shared ICU params for footer trust badges. */
export function getFooterTrustCopyParams() {
  return {
    freeShipping: { amount: marketingNumbers.freeShippingFooterUsd },
    returns: { days: marketingNumbers.returnsDays },
    authenticity: { percent: marketingNumbers.authenticityPercent },
    concierge: {
      hours: marketingNumbers.supportHours,
      days: marketingNumbers.supportDays
    }
  } as const;
}

/** Shared ICU params for footer newsletter block. */
export function getFooterNewsletterCopyParams() {
  return {
    discount: marketingNumbers.newsletterDiscountPercent,
    count: marketingNumbers.newsletterMemberCount
  } as const;
}

/** Shared ICU params for home hero, marketplace, promo, FAQ, features, trust. */
export function getHomeMarketingCopyParams() {
  const n = marketingNumbers;
  return {
    hero: {
      year: n.seasonYear,
      rating: n.heroRating,
      count: n.heroShopperCount
    },
    marketplace: {
      count: n.marketplaceProductCount,
      brandCount: n.marketplaceBrandCount,
      rating: n.marketplaceRating
    },
    promo: {
      discount: n.promoDiscountPercent
    },
    faq: {
      amount: n.freeShippingHomeUsd,
      days: n.returnsDays
    },
    features: {
      amount: n.freeShippingHomeUsd,
      years: n.warrantyYears,
      hours: n.supportHours,
      days: n.supportDays
    },
    trust: {
      amount: n.freeShippingHomeUsd,
      days: n.returnsDays,
      bits: n.sslBits,
      hours: n.supportHours,
      daysSupport: n.supportDays
    },
    authSidebar: {
      bits: n.sslBits,
      days: n.returnsDays,
      hours: n.supportHours,
      daysSupport: n.supportDays
    },
    welcome: {
      days: n.returnsDays
    }
  } as const;
}

/** Footer bottom bar + copyright. */
export function getFooterBarCopyParams() {
  return {
    bits: marketingNumbers.sslBits,
    year: new Date().getFullYear()
  } as const;
}
