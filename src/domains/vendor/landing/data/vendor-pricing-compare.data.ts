import { PRICING_PLAN_IDS } from './vendor-landing.data';

export const PRICING_COMPARE_ROW_IDS = [
  'commission',
  'monthlyFee',
  'skuLimit',
  'payouts',
  'analytics',
  'promotions',
  'featuredListings',
  'support',
  'bulkImport',
  'apiAccess',
  'multiWarehouse',
  'accountManager',
  'customIntegrations',
  'slaSupport'
] as const;

export type PricingCompareRowId = (typeof PRICING_COMPARE_ROW_IDS)[number];
export type PricingPlanId = (typeof PRICING_PLAN_IDS)[number];

/** Cell value in the plan comparison matrix. */
export type PricingCompareCell =
  | { kind: 'check' }
  | { kind: 'dash' }
  | { kind: 'text'; valueKey: string };

export const PRICING_COMPARE_MATRIX: Record<
  PricingCompareRowId,
  Record<PricingPlanId, PricingCompareCell>
> = {
  commission: {
    starter: { kind: 'text', valueKey: 'commission12' },
    growth: { kind: 'text', valueKey: 'commission8' },
    enterprise: { kind: 'text', valueKey: 'custom' }
  },
  monthlyFee: {
    starter: { kind: 'text', valueKey: 'monthly0' },
    growth: { kind: 'text', valueKey: 'monthly49' },
    enterprise: { kind: 'text', valueKey: 'custom' }
  },
  skuLimit: {
    starter: { kind: 'text', valueKey: 'sku100' },
    growth: { kind: 'text', valueKey: 'skuUnlimited' },
    enterprise: { kind: 'text', valueKey: 'skuUnlimited' }
  },
  payouts: {
    starter: { kind: 'text', valueKey: 'payoutsStandard' },
    growth: { kind: 'text', valueKey: 'payoutsPriority' },
    enterprise: { kind: 'text', valueKey: 'payoutsCustom' }
  },
  analytics: {
    starter: { kind: 'text', valueKey: 'analyticsBasic' },
    growth: { kind: 'text', valueKey: 'analyticsAdvanced' },
    enterprise: { kind: 'text', valueKey: 'analyticsAdvanced' }
  },
  promotions: {
    starter: { kind: 'dash' },
    growth: { kind: 'check' },
    enterprise: { kind: 'check' }
  },
  featuredListings: {
    starter: { kind: 'dash' },
    growth: { kind: 'check' },
    enterprise: { kind: 'check' }
  },
  support: {
    starter: { kind: 'text', valueKey: 'supportEmail' },
    growth: { kind: 'text', valueKey: 'supportPriority' },
    enterprise: { kind: 'text', valueKey: 'supportSla' }
  },
  bulkImport: {
    starter: { kind: 'dash' },
    growth: { kind: 'check' },
    enterprise: { kind: 'check' }
  },
  apiAccess: {
    starter: { kind: 'dash' },
    growth: { kind: 'dash' },
    enterprise: { kind: 'check' }
  },
  multiWarehouse: {
    starter: { kind: 'dash' },
    growth: { kind: 'dash' },
    enterprise: { kind: 'check' }
  },
  accountManager: {
    starter: { kind: 'dash' },
    growth: { kind: 'dash' },
    enterprise: { kind: 'check' }
  },
  customIntegrations: {
    starter: { kind: 'dash' },
    growth: { kind: 'dash' },
    enterprise: { kind: 'check' }
  },
  slaSupport: {
    starter: { kind: 'dash' },
    growth: { kind: 'dash' },
    enterprise: { kind: 'check' }
  }
};

export { PRICING_PLAN_IDS };
